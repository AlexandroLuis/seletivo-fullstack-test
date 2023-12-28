import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000';
  private storage?: Storage;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.storage = window.localStorage;
    }
  }

  async login(mail: string, password: string): Promise<any> {
    const loginData = { mail, password };
    try {
      const response = await this.http.post<any>(`${this.apiUrl}/api/login`, loginData).toPromise();

      if (response && response.username) {
        this.storage?.setItem("U", response.username);
        this.storage?.setItem("C", "A");
        console.log(this.storage)
      }
      return response;

    } catch (error) {
      console.error('Error during login:', error);
      throw error; 
    }
  }  

  getHistory(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/history`);
  }

  addNewHistory(datetime: string, username: string, success: boolean, repositories: number): Observable<any> {
    const historyData = { datetime, username, success, repositories };
    return this.http.post<any>(`${this.apiUrl}/api/history-add`, historyData);
  }

  getLoggedInUser(): any {
    return this.storage?.getItem("U");
  }

  isUserLoggedIn(): boolean {
    if (this.storage?.getItem("C") == 'A')
      return true;
    else
      return false;
  }

  async updateUserInfo(username: string, mail: string, newPassword: string): Promise<any> {
    try {
      const editData = { username, mail, newPassword };
      console.log(editData)
      const response = await this.http.put<any>(`${this.apiUrl}/api/edit`, editData).toPromise();

      if (response && response.message === 'User information updated successfully') { }

      return response;
    } catch (error) {
      console.error('Error editing user information:', error);
      throw error;
    }
  }

  deleteHistoryItem(itemId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/history/${itemId}`);
  }

  logout(): void {
    this.storage?.setItem("U", 'null'); // Clear logged-in user data
    this.storage?.setItem("C", "D")
  }
}
