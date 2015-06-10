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
    // var dateClicked = dateObject.toString;
    this.setState({dateClicked: dateClicked});
  },
  render: function() {
    var dateClicked = this.state.dateClicked;
    return (
      <div class="row" id="tracker">
        <h1>Shopping Tracker</h1>
        <div className="col-md-6">
          <Calendar defaultValue={new Date()} footer={true} onChange={this.handleChange} />
        </div>
        <div className="col-md-6 single-day">
          <div><h2>{dateClicked}</h2></div>
          <div className="logged-message">
            <div className="logged-message-title">
              Chris #shopped
            </div>
            <div className="logged-message-text">
              Bought laundry detergent, pizza, Curry jersey, and some shampoo for my beard #shopped
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Tracker;


// <Calendar footer={true}/>, mountNode);