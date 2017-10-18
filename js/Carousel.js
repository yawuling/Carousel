(function (window, document) {
  function Carousel(options) {
    if (!(this instanceof Carousel)) {
      return new Carousel(options);
    } else {
      this.el = (options.el && (options.el instanceof HTMLElement)) ? 
        options.el :
        document.querySelector(options.el);
      this.imgs = options.imgs;
      this.imgs.push(this.imgs[0]);
      this.imgs.unshift(this.imgs[options.imgs.length - 2]);
      this.autoPlay = options.autoPlay || false;
      this.timer = null;
      this.time = options.time || 300;
      this.index = 1;
      this.imgNodes = [];
      this._init();
    }
  }
  Carousel.prototype = {
    _init: function () {
      console.log(this.el)
      this.el.style.overflow = 'hidden';
      var fragement = document.createDocumentFragment();
      this.width = this.el.clientWidth;
      console.log(this.width);
      var content = document.createElement('div');
      content.style.width = this.width * this.imgs.length + 'px';
      content.style.height = '100%';
      content.style.transform = 'translate(-' + this.width + 'px, 0)';
      content.id = 'carousel-content';
      fragement.appendChild(content);
      this.content = content;
      this._eventBind(content);
      for (var i = 0; i < this.imgs.length; i++) {
        var img = document.createElement('img');
        img.style.height = '100%';
        img.style.display = 'inline-block';
        img.style.width = this.width + 'px';
        img.src = this.imgs[i];
        this.imgNodes.push(img);
        content.appendChild(img);
      }
      this.el.appendChild(fragement);
      if (this.autoPlay) {
        this._autoPlay();
      }
      this._onResize();
    },
    _slide: function (index) {
      var that = this;
      that.index = index;
      that.content.style.WebkitTransition = 'all ' + that.time + 'ms';
      that.content.style.transition = 'all ' + that.time + 'ms';
      that.content.style.transform = 'translate(-' + that.width * that.index + 'px, 0)';
      setTimeout(function () {
        that.content.style.WebkitTransition = 'all 0ms';
        that.content.style.transition = 'all 0ms';
      }, that.time);
      var flag = false;

      if (that.index == 0) {
        that.index = that.imgs.length - 2;
        flag = true;
      } else if (that.index == that.imgs.length - 1) {
        that.index = 1;
        flag = true;
      }
      if (flag) {
        setTimeout(function () {
          that.content.style.transform = 'translate(-' + that.width * that.index + 'px, 0)';
        }, that.time);
      }
    },
    _eventBind: function (content) {
      var startx, starty, endx, endy;
      var that = this;
      var direction;
      var startTime, endTime;
      var isTouchMove = false;
      content.addEventListener('touchstart', function (event) {
        event.preventDefault();
        if (that.autoPlay) {
          clearInterval(that.timer);
        }
        startx = event.touches[0].pageX;
        starty = event.touches[0].pageY;
        startTime = new Date().getTime();
      }, false);
      content.addEventListener('touchmove', function (event) {
        if (event.changedTouches.length !==1 || startx === 0 || starty === 0) {
          return;
        }
        endx = event.changedTouches[0].pageX;
        endy = event.changedTouches[0].pageY;
        content.style.transform = 'translate(' + (-that.width * that.index + endx - startx) + 'px, 0)';
        endTime = new Date().getTime();
        isTouchMove = true;
      }, false);
      content.addEventListener('touchend', function (event) {
        if ((Math.abs(endx - startx) > that.width / 2 || 
            Math.abs((endx - startx) / (endTime - startTime)) > 0.7) && isTouchMove)
        {
          direction = getDirection(startx, starty, endx, endy);
          switch (direction) {
            case 1:
              that._slide(that.index - 1);
              break;
            case 3:
              that._slide(that.index + 1);
              break;
          }
          isTouchMove = false;
        } else {
          that.content.style.WebkitTransition = 'all ' + that.time + 'ms';
          that.content.style.transition = 'all ' + that.time + 'ms';
          content.style.transform = 'translate(-' + that.width * that.index + 'px, 0)';
          setTimeout(function () {
            that.content.style.WebkitTransition = 'all 0ms';
            that.content.style.transition = 'all 0ms';
          }, that.time);
        }
        if (that.autoPlay) {
          that._autoPlay();
        }
      }, false);
      
      function getAngle (x, y) {
        return Math.atan2(y, x) * 180 / Math.PI;
      }
      function getDirection (startx, starty, endx, endy) {
        var x = endx - startx;
        var y = endy - starty;
        if (Math.abs(x) < 2 && Math.abs(y) < 2) {
          return;
        }
        var angle = getAngle(x, y);
        if (angle >= -45 && angle < 45) {
          return 1;
        } else if (angle >= 45 && angle < 135) {
          return 2;
        } else if ((angle >= 135 && angle < 180) || (angle >= - 180 && angle < -135)) {
          return 3;
        } else if (angle >= -135 && angle < -45) {
          return 4;
        }
      }
    },
    _autoPlay: function () {
      var that = this;
      that.timer = setInterval(function () {
        that._slide(that.index + 1);
      }, that.autoPlay);
    },
    _onResize: function () {
      var that = this;
      window.addEventListener('resize', function () {
        that.width = that.el.clientWidth;
        console.log(that.width);
        that.content.style.width = that.width * that.imgs.length + 'px';
        that.imgNodes.forEach(function (item) {
          item.style.width = that.width + 'px';
        });
        that._slide(that.index);
      }, false);
    }
  }
  window.Carousel = Carousel;
})(window, document);