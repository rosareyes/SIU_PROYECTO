if ('Accelerometer' in window) {
    let tiltedRight = false;
    let tiltedLeft = false;
    try {
      const acc = new Accelerometer({ frequency: 10 });
      acc.onreading = () => {
        console.log(acc.x)
        if (acc.x > 9) {
          if(!tiltedRight) {
            tiltedRight = true;
            document.body.style.backgroundColor = "green";
            navigator.vibrate([500]);
          }
        } else if (acc.x < -9) {
          if(!tiltedLeft) {
            tiltedLeft = true;
            document.body.style.backgroundColor = "red";
            navigator.vibrate([500]);
          }
        } else {
          tiltedRight = false;
          tiltedLeft = false;
        }
      };
  
      acc.start();
    } catch (err) {
      console.log(err);
    }
  }