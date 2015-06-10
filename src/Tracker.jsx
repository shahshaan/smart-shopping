var React = require('react');
var Eventful = require('eventful-react');
var Calendar = require('react-widgets').Calendar

var Tracker = React.createClass({
  getInitialState : function() {
    var todaysDateInstance = new Date();
    todaysDate = (todaysDateInstance.getMonth() + 1).toString() + '/' + todaysDateInstance.getDate().toString() + '/' + todaysDateInstance.getFullYear().toString();
    return {
      dateClicked: todaysDate,
      name: '',
      value: ''
    };
  },
  handleChange: function(dateObject) {
    console.log('onChange is calling this');
    var dateClicked = (dateObject.getMonth() + 1).toString() + '/' + dateObject.getDate().toString() + '/' + dateObject.getFullYear().toString();
    this.setState({dateClicked: dateClicked});
  },
  render: function() {
    var dateClicked = this.state.dateClicked;
    return (
      <div>
        <Calendar defaultValue={new Date()} footer={true} onChange={this.handleChange} />
        <div>Date selected: {dateClicked}</div>
      </div>
    );
  }
});

module.exports = Tracker;


// <Calendar footer={true}/>, mountNode);