function validate() {
      
    if( document.addBooking.adults.value == "" && document.addBooking.infants.value == ""  ) {
       alert( "Adult or Infant value is required" );
       document.addBooking.adults.focus() ;
       document.addBooking.infants.focus() ;
       return false;
    }
    else if( document.addBooking.hotel.value == "" ) {
       alert( "Please select an option for hotel" );
       document.addBooking.hotel.focus() ;
       return false;
    }
    else if( document.addBooking.tourCompany.value == "" ) {
       alert( "Please select an option for Tour Company" );
       document.addBooking.tourCompany.focus() ;
       return false;
    }
    else if( document.addBooking.programs.value == "" ) {
       alert( "Please select a program" );
       document.addBooking.programs.focus() ;
       return false;
    }
    else if( document.addBooking.exc_date.value == "" ) {
       alert( "Please select an Excursion Date" );
       document.addBooking.exc_date.focus() ;
       return false;
    }
    else if( document.addBooking.shedule.value == "" ) {
       alert( "Please select a shedule time" );
       document.addBooking.shedule.focus() ;
       return false;
    }
    else if( document.addBooking.fname.value == "" ) {
       alert( "Please enter a contact name" );
       document.addBooking.fname.focus() ;
       return false;
    }
    else if( document.addBooking.lname.value == "" ) {
       alert( "Please enter a contact name" );
       document.addBooking.lname.focus() ;
       return false;
    }
    else if( document.addBooking.email.value == "" ) {
       alert( "Please enter a contact email" );
       document.addBooking.email.focus() ;
       return false;
    }
    else if( document.addBooking.cell.value == "" ) {
       alert( "Please enter a contact number" );
       document.addBooking.cell.focus() ;
       return false;
    } else {

        return( true );
        document.addBooking.reset();
    }


 }