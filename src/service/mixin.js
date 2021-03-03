
import Swal from "sweetalert2/dist/sweetalert2.js";

const Toast = Swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,  
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

var myMixin = {
 
    methods: {  
      getUserDetails(){        
        return this.$store.state.userDetails;
      },   
    showSuccess(msg){
      Toast.fire({
        icon: 'success',
        title: msg,
        timer: 2000
      })      
    },
    showError(msg){
      Toast.fire({
        icon: 'error',
        title: msg,
        timer: 4000
      })       
    }
    }
  }
  export var mixin = myMixin;