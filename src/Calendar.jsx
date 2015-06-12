var React = require('react');
var Eventful = require('eventful-react');
var CalendarComponent = require('react-widgets').Calendar



var DayComponent = Eventful.createClass({
  render: function() {
    var dateClicked = window.dateClicked;
    var curDate = dateClicked.slice(0, dateClicked.indexOf('/')) + '/' + this.props.label + '/' + dateClicked.slice(-2);
    var events = window.events;
    var idString = '';

    if (events[curDate]) {
      idString += 'event';
    };

    return (
      <div id={idString} >
        {this.props.label}
      </div>);
    }
});

var Calendar = Eventful.createClass({

  getInitialState : function() {
    return {
    };
  },
  handleChange: function(dateInstance) {
    this.emit('dateClicked',{
      dateInstance: dateInstance
    });
  },

  render: function() {
    var props = {
      events: this.props.events,
      dayComponent: DayComponent,
      defaultValue: new Date(),
      onChange: this.handleChange
    }
    return (
      <div>
        <CalendarComponent {...props} />
        {this.props.dateClicked}
      </div>
    )
  }
})

module.exports = Calendar;
  
