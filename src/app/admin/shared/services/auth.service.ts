import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../../../shared/interfaces";
import {Observable} from "rxjs";

@Injectable()
export class AuthService {

  get token(): string {
    return ''
  }

  constructor(
    private http: HttpClient,
  ) {
  }

  public login(user: User): Observable<any> {
    return  this.http.post('', user)
  }

  public logout(): void {

  }

  public isAuthenticated(): boolean {
    return !!this.token
  }

  private setToken(): void {

  }
}
