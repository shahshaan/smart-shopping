var React = require('react');
var Eventful = require('eventful-react');
var CalendarComponent = require('react-widgets').Calendar
var Calendar = require('./Calendar.jsx');

var Tracker = Eventful.createClass({

  getInitialState: function() {
    var todaysDateInstance = new Date();
    var todaysDate = (todaysDateInstance.getMonth() + 1).toString() + '/' + todaysDateInstance.getDate().toString() + '/' + todaysDateInstance.getFullYear().toString();
    var events = {
        "6/07/15":[{
            1:{
              id:1,
              name:'person1',
              sender_id:11,
              sender_type:'person',
              text:'testing 1',
              user_id:11
            }
          }, {
            2:{
              id:2,
              name:'person2',
              sender_id:12,
              sender_type:'person',
              text:'testing 2',
              user_id:12
            }
          }],
        "6/10/15": [{
            3:{
              id:3,
              name:'person3',
              sender_id:13,
              sender_type:'person',
              text:'testing 3',
              user_id:13
            }
          }, {
            4:{
              id:4,
              name:'person4',
              sender_id:14,
              sender_type:'person',
              text:'testing 4',
              user_id:14
            }
          }],
        "6/11/15":[{
            5:{
              id:5,
              name:'person5',
              sender_id:15,
              sender_type:'person',
              text:'testing 5',
              user_id:15
            }
          }, {
            6:{
              id:6,
              name:'person6',
              sender_id:16,
              sender_type:'person',
              text:'testing 6',
              user_id:16
            }
          }]
      }
    window.events = events;
    return {
      dateClicked: todaysDate
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
      window.dateClicked = this.state.dateClicked;

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


