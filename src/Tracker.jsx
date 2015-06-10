var React = require('react');
var Eventful = require('eventful-react');
var Calendar = require('react-widgets').Calendar

var Tracker = React.createClass({
  getInitialState : function() {
    var todaysDateInstance = new Date();
    todaysDate = (todaysDateInstance.getMonth() + 1).toString() + '/' + todaysDateInstance.getDate().toString() + '/' + todaysDateInstance.getFullYear().toString();
    return {
      dateClicked: todaysDate,
    };
  },
  handleClick: function() {
    console.log('calendar clicked');
    var dateClicked = document.getElementById('rw_1_view_selected_item').innerHTML;
    this.setState({dateClicked: dateClicked});

  },
  render: function() {
    var activeDate = this.state.dateClicked;
    return (
      <div>
        <Calendar defaultValue={new Date()} footer={true} onClick={this.handleClick} />
        <div>Date selected: {activeDate}</div>
      </div>
    );
  }
});

module.exports = Tracker;


// <Calendar footer={true}/>, mountNode);