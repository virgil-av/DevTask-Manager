import {Injectable, OnDestroy} from '@angular/core';
import {tokenNotExpired} from 'angular2-jwt'
import {Options} from "../shared/auth.options";
import {Router} from "@angular/router";


// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class AuthService{

// Configure Auth0
  lock = new Auth0Lock('HzHnW0yfwJL85g81wqrYG6y9c2pKdiwR', 'syrusstk.eu.auth0.com', Options);

//Store profile object in auth class
  userProfile: any;


  constructor(private router: Router) {



    // Set userProfile attribute of already saved profile
    this.userProfile = JSON.parse(localStorage.getItem('profile'));


    // Add callback for the Lock `authenticated` event
    this.lock.on("authenticated", (authResult) => {
      localStorage.setItem('id_token', authResult.idToken);

      // Fetch profile information
      this.lock.getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          // Handle error
          alert(error);
          return;
        }

        localStorage.setItem('profile', JSON.stringify(profile));
        this.userProfile = profile;

      });

      var redirectUrl: string = localStorage.getItem('redirect_url');
      if(redirectUrl != undefined){
        this.router.navigate([redirectUrl]);
        localStorage.removeItem('redirect_url');
      }

      setTimeout(() => { this.router.navigate(['/dashboard']) }, 500);
    });

  };

  public login() {
    // Call the show method to display the widget.
    this.lock.show();
  };

  public authenticated() {
    // Check if there's an unexpired JWT
    // This searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  };

  public logout() {
    // Remove token and profile from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    // this.userProfile = undefined;
    this.router.navigate(['/'])
  };

  public isAdmin() {
    return this.userProfile && this.userProfile.app_metadata
      && this.userProfile.app_metadata.roles
      && this.userProfile.app_metadata.roles.indexOf('admin') > -1;
  }

  public loggedUser(){
    if(this.userProfile && this.userProfile.user_metadata && this.userProfile.user_metadata.name){
      return this.userProfile.user_metadata.name
    }
  }



}
