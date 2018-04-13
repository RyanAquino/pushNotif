import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
/*
  Generated class for the NotifProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotifProvider {

  constructor(private afdb:AngularFireDatabase, private afAuth:AngularFireAuth,public http: HttpClient) {
  }

  sendRequest(token){
      let body = {
        "notification": {
          "title": "You have a parking request!",
          "body": "",
          "sound": "default",
          "click_action": "FCM_PLUGIN_ACTIVITY",
          "icon": "fcm_push_icon"
        },
        "data": {
          "param1": "",
          "param2": "",
        },
        "to": token,
        "priority": "high",
        "restricted_package_name": ""
      };

      let options = new HttpHeaders().set('Content-Type', 'application/json');

      return this.http.post("https://fcm.googleapis.com/fcm/send", body, {
        headers: options.set('Authorization', 'key=AAAATAMgbb0:APA91bGzTj3yGmzzG2vwGruWKqP2CMxsR6Q0DbShzYCSXF8GVLWHbWgziQei94RN_fPoyp1DfIsfnEXLs8noN9nsuJ_RmaZtgD33QhdtIcoBrII4JHYvtZCJUbBpNp6UItTumab47e9P'),
      }).subscribe();
  }


  storeAccept(id){
    return this.afdb.list(`request`).push({
      user_id:id,
      request:'accepted'
    });
  }

  storeDecline(id){
    return this.afdb.list(`request`).push({
      user_id:id,
      request:'declined'
    });
  }

}
