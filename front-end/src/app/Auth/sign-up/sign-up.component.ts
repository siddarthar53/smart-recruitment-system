import { Component, OnInit } from '@angular/core';
import { EmailValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private authService:AuthService,private router: Router) {
    this.redirectIfLoggedIn();
   }

  ngOnInit(): void {
  }

  userData={
    name:'',
    phone:'',
    email:'',
    password:'',
    c_password:''
  };

  redirectIfLoggedIn() {
    if (this.authService.isAuthenticated()) {
      const role = this.authService.getUserRole();
      this.router.navigate([role === 'admin' ? '/admin/dashboard' : '/user/dashboard']);
    }
  }

  onSignUp(){
    if (this.userData.password !== this.userData.c_password) {
      console.error('Passwords do not match');
      return;
    }

    this.authService.signUp(this.userData).subscribe(
      (response) => {
        console.log('Sign-up successful', response);
        this.router.navigate(['login']);
      },
      (error) => {
        console.error('Sign-up failed', error.error.message);
        alert(error.error.message);
      }
    );

}

}
