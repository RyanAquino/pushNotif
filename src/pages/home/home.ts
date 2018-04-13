import { Component } from '@angular/core';
import { NavController, ActionSheetController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { NotifProvider } from '../../providers/notif/notif';
import { AuthProvider} from '../../providers/auth/auth';
// import firebase from 'firebase';
import { FCM } from '@ionic-native/fcm';
import { LoginPage } from '../login/login';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  uid;
  notif;
  users:Observable<any[]>;

  constructor(public actionSheetCtrl: ActionSheetController, private afAuth:AngularFireAuth,private authProvider:AuthProvider,private fcm:FCM,private notifProvider:NotifProvider,public navCtrl: NavController, public afdb: AngularFireDatabase, private alertCtrl:AlertController) {
    //?? where to put //working
    this.uid = this.afAuth.auth.currentUser.uid;
  }

  ngOnInit(){
    this.users = this.getUsers();
  
  }

  ngOnDestroy(){
    console.log('this is ngondestory / unsubscribe here');
  }

  ionViewDidLoad() {
    this.fcm.getToken().then(token => {
        this.afdb.object('profiles/' + this.uid).update({
          token:token
        });
      alert("this is get token");
    });

    this.fcm.onNotification().subscribe(data => {
      if (data.wasTapped) {
        this.notifAlert();
      } else {
        this.notifAlert();
      };
    });
    
    // trigger when?
    this.fcm.onTokenRefresh().subscribe(token => {
      this.afdb.object('profiles/' + this.uid).update({
        token: token
      });
      alert("this is on token refresh");
    });
  }

  onLogout(){
    this.authProvider.logoutUser()
    .then( () => {
      this.navCtrl.setRoot(LoginPage);
    });
  }


  notifAlert(){
    let alert = this.alertCtrl.create({
      title: 'Request!',
      message: 'Do you want to accept?',
      buttons: [
        {
          text: 'Accept',
          handler: () => {
            //save accept
            this.notifProvider.storeAccept(this.uid);
          }
        },
        {
          text: 'Reject',
          handler: () => {
            //save reject
            this.notifProvider.storeDecline(this.uid);
          }
        }
      ]
    });
    alert.present();
  }

  userSelected(user){

      let actionSheet = this.actionSheetCtrl.create({
        title: user.payload.val().email,
        buttons: [
          {
            text: 'Request',
            handler: () => {
              this.notifProvider.sendRequest(user.payload.val().token);
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });

      actionSheet.present();
  }

  getUsers() {
    return this.afdb.list<any>('profiles').snapshotChanges();

    //OR
    //BY USING SUBSCRIPTION 
    //Note* Needs to be unsubscribed onDestroy

    // users = [];
    //  this.getUsers();
    // subscription;


    // this.subscription = this.afdb.list<any>('profiles').snapshotChanges()
    // .subscribe( users => {
    //     this.users = users;
    // });

    // ngOnDestroy(){
    //   this.subscription.unsubscribe();
    // }

  }
}
