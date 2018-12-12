const express = require('express')
const router = express.Router()
const TraddingGroup = require('../models/traddingGroup')
const TraddingItem = require('../models/traddingItem')
const _ = require('underscore')


async function prepareData(items) {
	let newGroup = {
		items : items,
	  dateStart:'',
	  dateEnd : '', 
	  profit : 0,
	  tradeBuyTimes:0,
	  tradeSellTimes:0,
	  tradCost:0,
	  platformCost:0,
	};
	for(let i=0;i<items.length;i++){
		let ti = await TraddingItem.find({_id:items[i]})
    	.then(traddingItem => {
      	return traddingItem;
    	});
    newGroup.profit += parseFloat(ti[0].moneyChange);
    newGroup.tradCost += parseFloat(ti[0].tradCost);
    newGroup.platformCost += parseFloat(ti[0].platformCost);
    if(i==0){
  		newGroup.dateEnd = ti[0].date+' '+ti[0].time;
    }
    if(i==(items.length-1)){
    	newGroup.date = ti[0].date.slice(0,6);
  		newGroup.dateStart = ti[0].date+' '+ti[0].time;    }
    if(ti[0].isBuy){
    	newGroup.tradeBuyTimes++;
    }else{
    	newGroup.tradeSellTimes++;
    }
	}
  return newGroup;
}

router.put('/save', (req, res) => {
	let items = req.body.itemsGroup;
	if(items && items.length>0){
		for(let i=0;i<items.length;i++){
			console.log(items[i])
			TraddingItem.findOneAndUpdate({ _id : items[i]},{
				$set : { 
					isGrouped:true,
				}
			}).then(console.log('updated'))
		}
		prepareData(items).then( newGroup => {
			let traddingGroup = new TraddingGroup(newGroup)
	    traddingGroup.save( (err,item) => {
	      if (err) {
	        console.log("=========Error========");
	        console.log("Row Data Save Error"+err);
	      } else {
	        res.json(item);
	      }
	    });
		});
	}
});

router.put('/delete/:id',(req,res) => {
  TraddingGroup.findOne({ _id : req.params.id})
		.then(group => {
			TraddingItem.find({
		 	   _id: { $in: group.items }
			}).then((items) => {
				if( items.length>0 ){
					for(item of items){
						item.isGrouped = false;
					 	item.save(  (err, updatedTank) => {
					    if (err) return handleError(err);
					    console.log(item._id+'group links is deleted!');
					  });
					}
				}
			}).catch(err => res.json(err));
			try {
				TraddingGroup.deleteOne({_id:group._id}).then(()=>res.json('group deleted'))
			} catch (e) {
			 	console.log(e);
			}
		})
		.catch(err => res.json(err))
});

router.get('/getall', (req, res) => {
  TraddingGroup.find({})
		.then(traddingGroup => {
			res.json(traddingGroup)
		}).catch(err => {
			res.json(err)
		})
});

router.get('/get/:id', (req, res) => {
  TraddingGroup.findOne({ _id : req.params.id})
		.then(traddingGroup => {
			TraddingItem.find({
		 	   _id: { $in: traddingGroup.items }
			}).then((items) => {
				res.json({'group':traddingGroup,'items':items});				
			}).catch(err => {
				res.json(err);
			});
		}).catch(err => {
			res.json(err);
		})
});

// router.get('/get/:date',(req, res) => {
//   TraddingItem.find({date:req.params.date})
//     .then(traddingDayDetail => {
//       res.json(traddingDayDetail)
//     })
//     .catch(err => {
//       res.json(err)
//     })
// });
// //更新
// router.put('/traddingitem/:id',(req,res) => {
//   TraddingItem.findOneAndUpdate({ _id : req.params.id}
//        ,{ $set : { 
//             traddingMentalStatic: {
//               mistakeType:req.body.mistakeType,
//               fearType: req.body.fearType
//             }
//           }
//          },{
//            new : true
//          })
//        .then(item => res.json(item))
//        .catch(err => res.json(err))
// });

module.exports = router
