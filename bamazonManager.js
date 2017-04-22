var mysql = require("mysql");
var prompt = require("prompt");
var inquirer = require("inquirer");
var Table = require("cli-table");
var colors = require("colors");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "root",
	database: "bamazondb"
}); 

connection.connect(function(err){
	if (err) throw err;
});


var manager = function(){

	inquirer.prompt([
			{
				type: "rawlist",
				message: "What would you like to do?",
				choices: ["View products for sale", "View low inventory", "Add to inventory", "Add new product"],
				name: "action"
			}

		]).then(function(choice){

				switch(choice.action){
					case "View products for sale":
						console.log("comparison is working");
						viewProducts();
						break;

					case "View low inventory":
						console.log("view low is working");
						lowInventory();
						break;

					case "Add to inventory":
						console.log("add to is working too");
						addInventory();
						break;

					case "Add new product":
						console.log("add new is also working");
						addNew();
						break;
				}


			

		});

var viewProducts = function(){


connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM inventory", function(err, res){

		var table = new Table({
			chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },

    		head: ["ID", "Name", "Department", "Price", "Stock"]
		});

		for (var i = 0; i < res.length; i++){
		
			table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
		}

		console.log(table.toString());

		manager();

});

}


var lowInventory = function(){

	connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM inventory", function(err, res){

		for (var i = 0; i < res.length; i++){
			if (parseInt(res[i].stock_quantity) <= 6){

				console.log("Running low on " + res[i].product_name + ". Only " + res[i].stock_quantity + " remaining.");

				return;


			}

			// else (parseInt(res[i].stock_quantity) >= 7){
			// 	console.log("Stock levels are within acceptable range.");
			// 	return;
			// };

		}
			
		
	});

	

}


var addInventory = function(){

	connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM inventory", function(err, res){

		var table = new Table({
			chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },

    		head: ["ID", "Name", "Department", "Price", "Stock"]
		});

		for (var i = 0; i < res.length; i++){
		
			table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
		}

		console.log(table.toString());
	

			inquirer.prompt([

					{
						type: "input",
						message: "Select ID of item to replenish",
						name: "ID"
					},

					{
						type: "input",
						message: "How many units are you adding?",
						name: "units"
					}


				]).then(function(choice){

					//find item by id, and add choice.units to stock_quantity

				connection.query("SELECT item_id, product_name, stock_quantity FROM inventory WHERE ?",{item_id: choice.ID}, function(err, res){


					

				if(choice.units > 0){

						connection.query("UPDATE inventory SET ? WHERE ?", [{stock_quantity: parseInt(res[0].stock_quantity) + parseInt(choice.units)}, {item_id: choice.ID}], function(err, data){

							console.log("You Added!" + choice.units + " " + res[0].product_name);
						// })

							return inquirer.prompt([

							{
								type: "rawlist",
								message: "Add more items?",
								choices: ["YES", "NO"],
								name: "continue"
							}
					]).then(function(decision){

						if(decision.continue === "YES"){
							addInventory();
						}

						else if(decision.continue === "NO"){
							console.log("until next time");
							process.exit();
						}
					});

					})

				}

					



				});

				// inquirer.prompt([

				// 			{
				// 				type: "list",
				// 				message: "Add more items?",
				// 				choices: ["YES", "NO"],
				// 				name: "continue"
				// 			}
				// 	]).then(function(decision){

				// 		if(decision.continue === "YES"){
				// 			addInventory();
				// 		}

				// 		else if(decision.continue === "NO"){
				// 			console.log("until next time");
				// 		}
				// 	});


			});

	});

}

}

manager();