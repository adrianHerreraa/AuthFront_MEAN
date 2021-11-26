import { Component } from '@angular/core';

// Forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Router
import { Router } from '@angular/router';

// Services
import { AuthService } from '../../services/auth.service';

// SweetAlert
import Swal  from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent {

  miFormulario: FormGroup = this.fb.group({
    email: ['test2@test.com', [Validators.required, Validators.email] ],
    password: ['123456', [Validators.required, Validators.minLength(6)]],
  });

  constructor( 
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService,
  ) { }

  login(){
    const { email, password } = this.miFormulario.value;
    

    this.authService.login( email, password).subscribe(
      (ok) => {
        // console.log(resp);
        if( ok === true ){
          this.router.navigateByUrl('/dashboard');
        }else{
          Swal.fire({
            title: 'Error',
            text: ok.msg,
            icon: 'error',
            // confirmButtonText: '',
            // confirmButtonColor: 'blue',
          })
        }
      },
    );
  }

}
