import { Injectable } from '@angular/core';
import { Auth, User, authState, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(private readonly auth: Auth) {
    this.user$ = authState(this.auth);
  }

  login(email: string, password: string): Observable<User> {
    return from(
      signInWithEmailAndPassword(this.auth, email, password).then(
        (cred) => cred.user as User
      )
    );
  }

  register(email: string, password: string): Observable<User> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then(
        (cred) => cred.user as User
      )
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }
}
