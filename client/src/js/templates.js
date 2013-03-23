this["JST"] = this["JST"] || {};

this["JST"]["views/clientside/start.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "        <div class=\"page-header\"><h1>Pick a pair</h1>\n        </div>\n        <i class=\"loading icon-spinner icon-spin icon-2x\"></i>\n        <div class=\"row-fluid\" id=\"users\">\n                </div>\n                <div class=\"actionbar\">\n                <div class=\"buttons pull-right\">\n                <button class=\"btn btn-large btn-primary btn-success\" id=\"startBtn\" type=\"button\" disabled=\"disabled\">Start Pomodoro</button>\n                </div>\n        </div>";
  });

this["JST"]["views/clientside/stats.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"page-header\"><h1>Stats for ";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h1>\n        </div>\n        <i class=\"loading icon-spinner icon-spin icon-2x\"></i>\n        <div id=\"statistics\">\n        </div>\n        <div class=\"actionbar\">\n            <div class=\"buttons pull-left\">\n                <button class=\"btn btn-large btn-primary\" id=\"backBtn\" type=\"button\">Back</button>\n            </div>\n        </div>";
  return buffer;
  });

this["JST"]["views/clientside/timer.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"page-header\">\n            <h1 id=\"timerPageHeader\">";
  if (stack1 = helpers.userOne) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.userOne; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " & ";
  if (stack1 = helpers.userTwo) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.userTwo; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h1>\n        </div>\n        <h1 class=\"timer\"></h1>\n        <h1 id=\"timerMessage\">Well done, now take a break.</h1>\n        <div class=\"actionbar\">\n            <div class=\"buttons pull-left\">\n                <button class=\"btn btn-large btn-primary\" id=\"changePairBtn\" type=\"button\">Change Pair</button>\n            </div>\n            <div class=\"buttons pull-right\">\n                <button class=\"btn btn-large btn-primary btn-success\" id=\"pomodoroBtn\" type=\"button\">Start Pomodoro</button>\n        <button class=\"btn btn-large btn-primary btn-danger\" id=\"breakBtn\" type=\"button\" disabled=\"disabled\">Take a break</button>\n                </div>\n        </div>";
  return buffer;
  });

this["JST"]["views/clientside/user.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"span3 user\">\n            <i class=\"chart-icon icon-bar-chart\"></i>\n            <img src=\"";
  if (stack1 = helpers.image) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.image; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"img-circle avatar\">\n            <p class=\"name\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\n        </div>";
  return buffer;
  });