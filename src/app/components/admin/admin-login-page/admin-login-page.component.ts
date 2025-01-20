import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnlinefoodService } from '../../service/onlinefood.service';
import { take } from 'rxjs';

@Component({
  standalone:false,
  selector: 'app-admin-login-page',
  templateUrl: './admin-login-page.component.html',
  styleUrls: ['./admin-login-page.component.css']
})
export class AdminLoginPageComponent implements OnInit {

  email: string = "";
  password: string = "";

  constructor(
    private router:Router,
    private oService:OnlinefoodService
  ) { }

  ngOnInit(): void {
  }
  signIn(): void {
    const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; 
    if (!pattern.test(this.email)) {
      alert("Email is not valid.");
      return;
    }
    if (this.password === '') {
      alert("Password should not be blank");
      return;
    }
    //alert("sucess")
    const body = {
      "adminEmailId": this.email,
      "adminPassword": this.password
    }
    
    this.oService.adminSignIn(body).pipe(take(1)).subscribe((res :any) => {
      console.log("*****",res);
      if(res && res?.adminId){
        let userName = '';
        if (res?.firstName) {
          userName+=res?.firstName;
        }
        if (res?.lastName){
          userName+=' ' + res?.lastName;
        }
        this.oService.storeAdminUserName(userName);
        this.oService.storeAdminAuthorization(res?.adminId);
        this.router.navigate(['/admin/home']);
       
      }
    },
   err => {
  console.log("Error ", err);
  console.log(">>> ", err);
  if(err?.error && err?.error.startsWith("Admin not found with") ){
    alert("Admin email/password invalid");
  }
  else{
    alert("Something going wrong in login! pl try again");
  }
})
  }

}