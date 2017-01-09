/**
 * Created by Sumit Patel on 07/01/2017.
 */
if (navigator.serviceWorker) {
    navigator.serviceWorker.register('./service-worker.js').then(function (reg) {
        console.log("src registered");
    }).catch(function (error) {
        console.log(error);
    });
}




