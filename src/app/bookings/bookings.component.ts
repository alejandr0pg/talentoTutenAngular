import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  token: string;
  user;

  constructor(
    private auth: AuthService,
    private http: HttpClient
  ) {
    this.user = this.auth.currentUserValue;
    this.token = this.user.sessionTokenBck;
  }

  ngOnInit() {
    const email = "contacto@tuten.cl";

    const headers = new HttpHeaders({
      'Content-Type':'application/json; charset=utf-8',
      'app': 'APP_BCK',
      'adminemail': this.user.email,
      'email': email,
      'token': this.token
    });

    return this.http.get(
      `${environment.apiUrl}/user/${email}/bookings?current=true`, { headers: headers }
    ).subscribe(res => {
      console.log('booking', res);
    });
  }

}
