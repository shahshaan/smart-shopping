var React = require('react');
var Eventful = require('eventful-react');
var CalendarComponent = require('react-widgets').Calendar


var DayComponent = Eventful.createClass({
 render: function() {
   var day = this.props.label;
   var idString = '';
   var dates = [4, 6, 9, 11, 21];

   if (dates.indexOf(parseInt(day)) > -1) {
     idString += 'event';
   };

   return (<div id={idString} >
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
    return (
      <div>
        <CalendarComponent dayComponent={DayComponent} defaultValue={new Date()} onChange={this.handleChange} />
        {this.props.dateClicked}
      </div>
    )
  }
})

module.exports = Calendar;