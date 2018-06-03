var diceRoll = 0;
var stopRoll = true;
var timeoutSet;
var cardNumbers = [0,0,2,2,2,2,2,2,2,2,1,1,1,1,1];
var cardCostNuts = [0,0,2,3,3,4,5,6,7,8,8,9,9,10,10];
var ownCards = [0,0,0,0,0,0];
var needSelectLoaction = false;
var needRollDice = false;
var needBuyAction = 0;
var nowPlaceCard = 0;
var marketCards = [0,0,0,0,0,0];
var faceOfDice;
var playerNut = 0;
var playerNutPlus = 0;
var round = 1;
var actoinUsed = [false,false,false,false,false,false];
var toastTimeout;
var winGoalOfNutPlus = 7;

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
		if(ownCards[loaction-1]!=0)
		{
			for(var i in ownCards)
			{
				if(ownCards[i]==0)
				{
					toastMsg("你尚未填滿行動列，不能覆蓋已有行動！");
					break;
				}
				if(i==ownCards.length-1)
				{
					d3.select("#cardInLocation"+loaction).attr(
					{
						"href":"./img/cardno"+nowPlaceCard+".png",
					});
					ownCards[loaction-1] = nowPlaceCard;
					endSelection();
				}
			}
		}
		else
		{
			d3.select("#cardInLocation"+loaction).attr(
			{
				"href":"./img/cardno"+nowPlaceCard+".png",
			});
			ownCards[loaction-1] = nowPlaceCard;
			endSelection();
		}
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
		rollDiceSet(true);
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
	if(roundReset)
	{
		actoinUsed = [false,false,false,false,false,false];
		d3.select("#doingActionStroke").attr("style","display:None;");
	} 
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
		toastMsg("沒有足夠的牌可以補滿市場了，你失敗了！");
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
		else
		{
			if(marketCards[i-1]==0)
			{
				marketCards[i-1] = marketCards[i];
				marketCards[i]=0;
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
	if(playerNut >= winGoalOfNutPlus) toastMsg("存到足夠過冬的松果了！恭喜你獲勝！");
}

function doPlayerAction(actionNo)// actionNo=1~6
{	
	actionNo = actionNo-1;
	while(ownCards[actionNo]==0)//陣列只有0~5，減一做特別處理
	{
		if(actionNo==5) actionNo=0;
		else actionNo++;
	}

	d3.select("#doingActionStroke").attr("x",actionNo*200+10).attr("y",10).attr("style","");

	if(actoinUsed[actionNo] == true)
	{
		toastMsg("額外行動無法觸發已執行過的行動(跳過)！");
		updateResourceUI();
		buyActionSet();
		return;
	}
	console.log("b",actoinUsed);
	actoinUsed[actionNo] = true;
	console.log(actoinUsed);
	
	if(ownCards[actionNo]==1)
	{
		playerNut+=2;
		toastMsg("獲得2顆松果！目前共有"+playerNut+"顆松果。");
		updateResourceUI();
		buyActionSet();
	}
	else if(ownCards[actionNo]==2)
	{		
		playerNut+=4;
		toastMsg("獲得4顆松果！目前共有"+playerNut+"顆松果。");
		updateResourceUI();
		buyActionSet();
	}
	else if(ownCards[actionNo]==3)
	{
		if (confirm("用5顆一般松果執行保存松果的動作？")) 
		{
		    if(playerNut>=5)
			{
				playerNutPlus++;
				playerNut-=5;
				toastMsg("獲得1顆保存松果！");
			}
			else toastMsg("松果不足！");
		} 	
		updateResourceUI();
		buyActionSet();
	}
	else if(ownCards[actionNo]==4)
	{
		playerNut+=5;
		toastMsg("獲得5顆松果！目前共有"+playerNut+"顆松果。");
		updateResourceUI();
		buyActionSet();
	}
	else if(ownCards[actionNo]==5)
	{
		toastMsg("獲得1顆松果與1次額外行動！");
		playerNut+=1;
		updateResourceUI();
		rollDiceSet(false);
	}
	else if(ownCards[actionNo]==6)
	{
		toastMsg("獲得2顆松果與1次額外購買！");
		playerNut+=2;
		updateResourceUI();
		buyActionSet(2);
	}
	else if(ownCards[actionNo]==7)
	{
		toastMsg("獲得2顆松果與1次額外行動！");
		playerNut+=2;
		updateResourceUI();
		rollDiceSet(false);
	}	
	else if(ownCards[actionNo]==8||ownCards[actionNo]==9)
	{
		if (confirm("用4顆一般松果執行保存松果的動作？")) 
		{
			if(playerNut>=4)
			{
				playerNutPlus++;
				playerNut-=4;
				toastMsg("獲得1顆保存松果！");
			}
			else toastMsg("松果不足！");
		}
		updateResourceUI();
		buyActionSet();
	}
	else if(ownCards[actionNo]==10)
	{
		toastMsg("獲得3顆松果與1次額外行動！");
		playerNut+=3;
		updateResourceUI();
		rollDiceSet(false);
	}
	else if(ownCards[actionNo]==11)
	{
		if (confirm("用5顆一般松果執行保存松果的動作？")) 
		{
			if(playerNut>=5)
			{
				playerNutPlus++;
				playerNut-=5;
				toastMsg("獲得1顆保存松果！");
				if (confirm("再一次用5顆一般松果執行保存松果的動作？")) 
				{
					if(playerNut>=5)
					{
						playerNutPlus++;
						playerNut-=5;
						toastMsg("共獲得2顆保存松果！");
					}
					else toastMsg("松果不足！");
				}
			}
			else toastMsg("松果不足！");			
		}		
		updateResourceUI();
		buyActionSet();
	}
	else if(ownCards[actionNo]==12)
	{
		playerNut+=8;
		toastMsg("獲得8顆松果！目前共有"+playerNut+"顆松果。");
		updateResourceUI();
		buyActionSet();
	}
	else if(ownCards[actionNo]==13)
	{
		if (confirm("用3顆一般松果執行保存松果的動作？")) 
		{
			if(playerNut>=3)
			{
				playerNutPlus++;
				playerNut-=3;
				toastMsg("獲得1顆保存松果！");
			}
			else toastMsg("松果不足！");	
		}
		updateResourceUI();
		buyActionSet();
	}
	else if(ownCards[actionNo]==14)
	{
		if (confirm("用4顆一般松果執行保存松果的動作？")) 
		{
			if(playerNut>=4)
			{
				playerNutPlus++;
				playerNut-=4;
				toastMsg("獲得1顆保存松果！");
				if (confirm("再一次用4顆一般松果執行保存松果的動作？")) 
				{
					if(playerNut>=4)
					{
						playerNutPlus++;
						playerNut-=4;
						toastMsg("共獲得2顆保存松果！");
					}
					else toastMsg("松果不足！");
				}
			}
			else toastMsg("松果不足！");
		}
		updateResourceUI();
		buyActionSet();
	}
	console.log(actionNo);
}

function buyActionSet(actionTimes)
{
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
			toastMsg("跳過購買階段！");
			needBuyAction = 1;
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
				marketCards[loactionNo-1]=0;
				updateResourceUI();	
				endMarketPhase();							
				toastMsg("花費"+cost+"顆松果購買第"+loactionNo+"張行動，請選擇放置位置！");	
			}
			else
			{
				toastMsg("你的松果不足！無法購買這張卡片！");
				d3.select("#rabbitGuide").attr("src","./img/rabbitCantbuy.png");
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
	d3.select("#hanaGuide").attr("src","./img/guide2.png");
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

function toastMsg(msg)
{
	var x = document.getElementById("snackbar");
    x.className = "show";
    x.innerHTML = msg;
    toastTimeout = setTimeout(function(){ x.className = x.className.replace("show", "");}, 2000);
}
setUP();