/*****************************************************************************/
//Working with Lists and Collections


// Class to represent a row in the seat reservations grid
function SeatReservation(name, initialMeal) {
  var self = this;
  self.name = name;
  self.meal = ko.observable(initialMeal);
  
  self.formattedPrice = ko.computed(function() {
      var price = self.meal().price;
      return price !== undefined ? "$" + price.toFixed(2) : "None";
  });
}

// Overall viewmodel for this screen, along with initial state
function ReservationsViewModel() {
  var self = this;

  // Non-editable catalog data - would come from the server
  self.availableMeals = [
      { mealName: "Standard (sandwich)", price: 0 },
      { mealName: "Premium (lobster)", price: 34.95 },
      { mealName: "Ultimate (whole zebra)", price: 290 }
  ];    

  // Editable data
  self.seats = ko.observableArray([
      new SeatReservation("Steve", self.availableMeals[0]),
      new SeatReservation("Bert", self.availableMeals[0])
  ]);
  
  self.addSeat = function() {
      self.seats.push(new SeatReservation("DarthVader", self.availableMeals[2]));
  };
  self.removeSeat = function(seat) {
      self.seats.remove(seat)
  };
  
  self.totalSurcharge = ko.computed(function() {
      var total = 0;
      for(var i = 0; i < self.seats().length; i++) {
          total += self.seats()[i].meal().price;
      }
      return total;
  }, this);
      
}

ko.applyBindings(new ReservationsViewModel());

/*****************************************************************************/
// Loading and saving data

function Task(data) {
  this.title = ko.observable(data.title);
  this.isDone = ko.observable(data.isDone);
}

function TaskListViewModel() {
  // Data
  var self = this;
  self.tasks = ko.observableArray([]);
  self.newTaskText = ko.observable();
  self.incompleteTasks = ko.computed(function() {
      return ko.utils.arrayFilter(self.tasks(), function(task) { return !task.isDone() && !task._destroy });
  });

  // Operations
  self.addTask = function() {
      self.tasks.push(new Task({ title: this.newTaskText() }));
      self.newTaskText("");
  };
  //Old
  //self.removeTask = function(task) { self.tasks.remove(task) };
  self.removeTask = function(task) {self.tasks.destroy(task); };
  /*
      If you save the data now, you'll see that the server still receives the 
      destroyed items, and it can tell which ones you're asking to delete 
      (because they have a _destroy property set to true).
  */
  
  
  
  self.save = function() {
      $.ajax("/tasks", {
          data: ko.toJSON({tasks: self.tasks }),
          type: "post",
          contentType: "application/json",
          success: function(result) { alert(result) /*or something useful*/}
      });
  };
  
  // On load
  $.getJSON("/tasks", function(allData) {
      var mappedTasks = $.map(allData, function(item) {
          return new Task(item); 
      });
      self.tasks(mappedTasks);
  });
}

ko.applyBindings(new TaskListViewModel());


/*****************************************************************************/
