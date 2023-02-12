// Add to index.js or the first page that loads with your app.
document.addEventListener('deviceready', OneSignalInit, false);
function OneSignalInit() {
    // Uncomment to set OneSignal device logging to VERBOSE  
    // window.plugins.OneSignal.setLogLevel(6, 0);
    
    // NOTE: Update the setAppId value below with your OneSignal AppId.
    window.plugins.OneSignal.setAppId("951cdbf6-234a-486d-9c17-a274644c8843");
    window.plugins.OneSignal.setNotificationOpenedHandler(function(jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    });
    
    //Prompts the user for notification permissions.
    //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 6) to better communicate to your users what notifications they will get.
    window.plugins.OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
        console.log("User accepted notifications: " + accepted);
    });
}

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          Authorization: 'Basic YOUR_REST_API_KEY',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          included_segments: ['Subscribed Users'],
          contents: {en: 'English or Any Language Message', es: 'Spanish Message'},
          name: 'INTERNAL_CAMPAIGN_NAME'
        })
      };
      
      fetch('https://onesignal.com/api/v1/notifications', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}