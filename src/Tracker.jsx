var React = require('react');
var Eventful = require('eventful-react');
var CalendarComponent = require('react-widgets').Calendar
var Calendar = require('./Calendar.jsx');


var Tracker = React.createClass({

  getInitialState: function() {
    var todaysDateInstance = new Date();
    var todaysDate = (todaysDateInstance.getMonth() + 1).toString() + '/' + todaysDateInstance.getDate().toString() + '/' + todaysDateInstance.getFullYear().toString();
    return {
      dateClicked: todaysDate,
    };
  },
  componentDidMount: function() {
    this.on('dateClicked', function(data) {
      var dateInstance = data.dateInstance
      var dateClicked = (dateInstance.getMonth() + 1).toString() + '/' + dateInstance.getDate().toString() + '/' + dateInstance.getFullYear().toString();
      this.setState({
        dateClicked: dateClicked
      })
    });
  },
  render: function() {
    return (
      <div class="row" id="tracker">
        <h1>Shopping Tracker</h1>
        <div className="col-md-6">
          <Calendar dateClicked={this.state.dateClicked} />
        </div>
        <div className="col-md-6 single-day">
          <div><h2>{this.state.dateClicked}</h2></div>
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