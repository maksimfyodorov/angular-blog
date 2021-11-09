import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {FbAuthResponse, User} from "../../../shared/interfaces";
import {Observable, Subject, throwError} from "rxjs";
import {environment} from "../../../../environments/environment";
import {catchError, tap} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class AuthService {

  public error$ = new Subject<string>()

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
      tap(this.setToken),
      catchError(this.handleError.bind(this)),
    )
  }

  public logout(): void {
    this.setToken(null)
  }

  public isAuthenticated(): boolean {
    return !!this.token
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    const {message} = error.error.error

    switch (message) {
      case 'INVALID_EMAIL':
        this.error$.next('Неверный email')
        break
      case 'INVALID_PASSWORD':
        this.error$.next('Неверный пароль')
        break
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Такой email отсутствует в базе даных')
        break
    }

    return throwError(error)
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
