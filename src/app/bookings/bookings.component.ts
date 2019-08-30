import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  token: string;
  user;
  dataSource;
  displayedColumns: string[];

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private auth: AuthService,
    private http: HttpClient
  ) {
    this.user = this.auth.currentUserValue;
    this.token = this.user.sessionTokenBck;

    this.displayedColumns = ['bookingId', 'nameClient', 'bookingTime', 'streetAddress', 'bookingPrice'];
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
      ).pipe(map((user: any) => {

        user.map((array) => {
          array['nameClient'] = array['tutenUserClient']['firstName'] + ' ' + array['tutenUserClient']['lastName']
          return array;
        })
    
        return user;
      })).subscribe(async (res: any) => {
        console.log('booking', res);
        this.dataSource = await new MatTableDataSource(res);

        this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
