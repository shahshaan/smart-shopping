var React = require('react');
var Eventful = require('eventful-react');
var ModeToggle = require('./ModeToggle');
var List = require('./List');
var Tracker = require('./Tracker')
var auth = require('./auth');

var Home = Eventful.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  statics: {
    willTransitionTo: function (transition, _, _, cb) {
      auth.loggedIn(function(authed) {
        if (!authed) {
          transition.redirect('/login');
        }
        cb();
      });
    }
  },

  render: function() {
    var display;
    if (this.props.data.mode === ModeToggle.CALENDAR) {
      display = <Tracker />
    } else {
      display = <List items={this.props.data.items} mode={this.props.data.mode} />
    }

    return (
      <div id="home">
        <ModeToggle mode={this.props.data.mode} />
        {display}
      </div>
    );
  }
});

module.exports = Home;
