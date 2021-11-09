import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {FbAuthResponse, User} from "../../../shared/interfaces";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {tap} from "rxjs/operators";

@Injectable()
export class AuthService {

  get token(): string {
    const expDate = new Date(localStorage.getItem('fb-token-exp'))
    if (new Date > expDate) {
      this.logout()
      return null
    }
    return localStorage.getItem('fb-token')
  }

  constructor(
    private http: HttpClient,
  ) {
  }

  public login(user: User): Observable<FbAuthResponse> {
    user.returnSecureToken = true;
    return  this.http.post<FbAuthResponse>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
      user
    ).pipe(
      tap(this.setToken)
    )
  }

  public logout(): void {
    this.setToken(null)
  }

  public isAuthenticated(): boolean {
    return !!this.token
  }

  private setToken(res: FbAuthResponse | null): void {
    if (res) {
      const expDate = new Date(new Date().getTime() + +res.expiresIn * 1000);
      localStorage.setItem('fb-token', res.idToken)
      localStorage.setItem('fb-token-exp', expDate.toString())
    } else {
      localStorage.clear()
    }


  }
}
