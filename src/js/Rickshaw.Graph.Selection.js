Rickshaw.namespace('Rickshaw.Graph.Selection');

Rickshaw.Graph.Selection = function (args) {

  var graph = this.graph = args.graph;

  this.callback = args.callback || function () {};

  // Mouse pointer coordinates, updated on 'mousemove'
  this.startX = null;
  this.endX = null;
  this.startY = null;
  this.endY = null;

  this.active = false;
  this.lastEvent = null;
  this.visible = false;

  var element = this.element = document.createElement('div');
  element.className = 'rickshaw_overlay';
  graph.element.appendChild(element);

  var self = this;


  this.update = function (e) {
    e = e || this.lastEvent;
    if (!e) return;

    this.lastEvent = e;

    self.endX = e.offsetX;
    self.endY = e.offsetY;

    if (self.active) {
      this._setOverlayDimensions();
    }
  };

  this.graph.element.addEventListener(
    'mousedown',
    function (e) {
      self.startX = e.offsetX;
      self.startY = e.offsetY;

      self.active = true;
    },
    false
  );

  this.graph.element.addEventListener(
    'mouseup',
    function(e) {
      self.active = false;
      self.callback();
    },
    false
  );

  this.graph.element.addEventListener(
    'mousemove',
    function(e) {
      self.update(e);
    },
    false 
  );

  this.graph.onUpdate(function() { self.update(); } );

  this.hide = function() {
    this.visible = false;
    this.element.classList.add('inactive');
  };

  this.show = function() {
    this.visible = true;
    this.element.classList.remove('inactive');
  };

  this.render = function(domainX, detail, mouseX, mouseY) {
    this.show();
  };

  this._setOverlayDimensions = function() {
    var values = [self.startX, self.endX], 
        min = Math.min.apply(Math, values),
        max = Math.max.apply(Math, values);

    this.element.style.width = max - min;
    this.element.style.left = min;
    this.element.style.right = max;
    this.element.style.height = graph.height;
    this.element.style.top = 0;
  };
}
