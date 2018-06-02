var diceRoll = 0;
var stopRoll = true;
var timeoutSet;
var cardNumbers = [0,0,2,2,2,2,2,2,2,2,1,1,1,1,1];
var cardCostNuts = [0,0,2,3,3,4,5,6,7,8,8,9,9,10,10];
var ownCards = [0,0,0,0,0,0];
var needSelectLoaction = false;
var needRollDice = false;
var needBuyAction = false;
var nowPlaceCard = 0;
var marketCards = [0,0,0,0,0,0];
var faceOfDice;
var playerNut = 0;
var playerNutPlus = 0;
var round = 1;
var actoinUsed = [false,false,false,false,false,false];

function rollTheDice()
{
	if(needRollDice)
	{
		needRollDice = false;
		diceRoll = 0;
		stopRoll = false;
		changeDiceFace();
	}	
}

function changeDiceFace()
{
	if(stopRoll)
	{
		clearTimeout(timeoutSet);
		doPlayerAction(faceOfDice);
		return;
	}
	var timeoutSet=setTimeout("changeDiceFace()",50);	
	if(Number(diceRoll)>=10)
	{
		stopRoll=true;
	}
	diceRoll++;
	faceOfDice = Math.ceil(Math.random()*6);
	d3.select("#rollingDice").attr("src","./img/dice"+faceOfDice+".png");
}

function selectLocation(loaction)
{
	var xPlacement = (loaction-1)*200 + 20;
	var yPlacement = 20;
	if(needSelectLoaction)
	{
		d3.select("#cardInLocation"+loaction).attr(
		{
			"href":"./img/cardno"+nowPlaceCard+".png",
		});
		ownCards[loaction-1] = nowPlaceCard;
		endSelection();
	}	
}

function endSelection()
{
	d3.select("#playerActionAreaBG").attr("stroke","#000000");
	needSelectLoaction = false;
	nowPlaceCard = 0;
	rollDiceSet(true);
	d3.select("#rabbitGuide").attr("src","./img/rabbitThin.png");
	d3.select("#hanaGuide").attr("src","./img/guide1.png");
	return;
}

function selectLocationSet(cardNo)
{
	if(cardNo==0)
	{
		rollDiceSet();
	}
	else
	{
		d3.select("#playerActionAreaBG").attr("stroke","#AA0000");
		needSelectLoaction = true;
		nowPlaceCard = cardNo;
	}	
}

function rollDiceSet(roundReset)
{
	if(roundReset) actoinUsed = [false,false,false,false,false,false];
	needRollDice = true;
	d3.select("#rollingDice").attr("style","border-color:#AA0000;");
}

function setUP()
{
	playerNut = 2;	
	updateRemainCards();
	selectLocationSet(1);
	setMarketCard();
	updateResourceUI();
	updateMarketUI();
	updateRemainCards();
}

function updateRemainCards()
{
	var cards = 0;
	for(var i in cardNumbers)
	{
		cards = cards + cardNumbers[i];
	}
	d3.select("#remainCardsText").text(cards);
}

function setMarketCard()//放牌入市場，補滿
{
	if(d3.select("#remainCardsText").text()=="0")
	{
		console.log("youLose");
		return;
	}
	for(var i in marketCards)
	{
		if(marketCards[i]==0)//空格
		{
			var cardNo = Math.ceil(Math.random()*14);
			while(cardNumbers[cardNo]==0)//牌組裡還有
			{
				cardNo = Math.ceil(Math.random()*14);
			}
			cardNumbers[cardNo] = cardNumbers[cardNo]-1;
			marketCards[i]=cardNo;
		}
	}
}

function updateMarketUI()
{
	for(var i in marketCards)
	{
		if(marketCards[i]!=0)
		{
			d3.select("#marketLocation"+(i*1+1)).attr("href","./img/cardno"+marketCards[i]+".png");
		}
		else
		{
			d3.select("#marketLocation"+(i*1+1)).attr("href","");
		}
	}
}

function reloadMarket()//把市場得牌向左整理
{
	var zeroCount = 0;
	for(var i in marketCards)
	{
		if(i!=marketCards.length-1)
		{
			if(marketCards[i]==0)
			{
				
				var j=i
				for(;j<marketCards.length-1;j++)
				{
					if(marketCards[j]!=0)
					{
						marketCards[i]=marketCards[j];
						marketCards[j]=0;
						zeroCount++;
					}
					i=j;
				}
				
			}
		}		
	}
	for(var i=0 ; i<zeroCount;i++)
	{
		setMarketCard();
	}
}

function updateResourceUI()
{
	d3.select("#ownNutText").text(playerNut);
	d3.select("#ownNutPlusText").text(playerNutPlus);
}

function doPlayerAction(actionNo)// actionNo=1~6
{	
	actionNo = actionNo-1
	while(ownCards[actionNo]==0)
	{
		if(actionNo==5) actionNo=1;
		else actionNo++;
	}

	if(actoinUsed[actionNo] == true)
	{
		updateResourceUI();
		buyActionSet();
	}
	actoinUsed[actionNo] = true;
	
	if(ownCards[actionNo]==1)
	{
		playerNut+=2;
		updateResourceUI();
		buyActionSet();
	}
	else if(ownCards[actionNo]==2)
	{
		playerNut+=4;
		updateResourceUI();
		buyActionSet();
	}
	else if(ownCards[actionNo]==3)
	{
		if(playerNut>=5)
		{
			playerNutPlus++;
			playerNut-=5;
		}
		updateResourceUI();
		buyActionSet();
	}
	else if(ownCards[actionNo]==4)
	{
		playerNut+=5;
		updateResourceUI();
		buyActionSet();
	}
	else if(ownCards[actionNo]==5)
	{
		playerNut+=1;
		updateResourceUI();
		rollDiceSet(false);
	}
	else if(ownCards[actionNo]==6)
	{
		playerNut+=2;
		updateResourceUI();
		buyActionSet(2);
	}
	else if(ownCards[actionNo]==7)
	{
		playerNut+=2;
		updateResourceUI();
		rollDiceSet(false);
	}	
	else if(ownCards[actionNo]==8||ownCards[actionNo]==9)
	{
		if(playerNut>=4)
		{
			playerNutPlus++;
			playerNut-=4;
		}
		updateResourceUI();
		buyActionSet();
	}
	else if(ownCards[actionNo]==10)
	{
		playerNut+=3;
		updateResourceUI();
		rollDiceSet(false);
	}
	else if(ownCards[actionNo]==11)
	{
		if(playerNut>=5)
		{
			playerNutPlus++;
			playerNut-=5;
		}
		if(playerNut>=5)
		{
			playerNutPlus++;
			playerNut-=5;
		}
		updateResourceUI();
		buyActionSet();
	}
	else if(ownCards[actionNo]==12)
	{
		playerNut+=8;
		updateResourceUI();
		buyActionSet();
	}
	else if(ownCards[actionNo]==13)
	{
		if(playerNut>=3)
		{
			playerNutPlus++;
			playerNut-=3;
		}
		updateResourceUI();
		buyActionSet();
	}
	else if(ownCards[actionNo]==14)
	{
		if(playerNut>=4)
		{
			playerNutPlus++;
			playerNut-=4;
		}
		if(playerNut>=4)
		{
			playerNutPlus++;
			playerNut-=4;
		}
		updateResourceUI();
		buyActionSet();
	}
	console.log(actionNo);
}

function buyActionSet(actionTimes)
{
	console.log(marketCards);
	if(typeof actionTimes == 'undefined') actionTimes=1;
	d3.select("#rollingDice").attr("style","border-color:#FFE4B5;");
	d3.select("#marketAreaBG").attr("stroke","#AA0000");
	d3.select("#rabbitGuide").attr("src","./img/rabbitDownThin.png");
	d3.select("#hanaGuide").attr("src","./img/guide3.png");
	needBuyAction = actionTimes;
}

function selectMarketLocation(loactionNo)
{	
	if(needBuyAction>0)
	{
		if(loactionNo=="pass")
		{
			needBuyAction = false;
			endMarketPhase();
			selectLocationSet(0);
			d3.select("#rabbitGuide").attr("src","./img/rabbitThin.png");
			d3.select("#hanaGuide").attr("src","./img/guide1.png");
		}
		else
		{
			var cost = cardCostNuts[marketCards[loactionNo-1]];
			cost = cost*1 + loactionNo*1 -1;
			if(playerNut>=cost)
			{
				playerNut = playerNut - cost;
				selectLocationSet(marketCards[loactionNo-1]);
				updateResourceUI();	
				endMarketPhase();				
				marketCards[loactionNo-1]=0;		
			}
			else
			{
				d3.select("#hanaGuide").attr("src","./img/guide4.png");
				return;
			}
		}
	}
}

function leftCardAbandoned()
{
	var nonzeroCount = 0;
	for(var i in marketCards)
	{
		if(marketCards[i]!=0)
		{
			nonzeroCount++;
		}
	}
	if(nonzeroCount==6)
	{
		marketCards[0]=0;
	}
}

function endMarketPhase()
{
	needBuyAction--;
	if(needBuyAction<=0)
	{
		round++;
		d3.select("#roundText").text(round);
		d3.select("#marketAreaBG").attr("stroke","#000000");
		leftCardAbandoned();
		reloadMarket();
		setMarketCard();
		updateMarketUI();
		updateRemainCards();
	}	
}
setUP();