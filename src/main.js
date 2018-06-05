var diceRoll = 0;
var stopRoll = true;
var timeoutSet;
var cardNumbers = [0,0,4,3,3,2,2,2,2,2,2,2,2,2,2];//30張
var cardCostNuts = [0,0,2,3,3,3,3,5,5,5,7,7,7,7,10];
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
var costPlus = [0,0,1,2,3,3];
var recTextOn = false;//測試文字
var buyCardInfo = [0,0];
var roundBeginNut = [0,0];

function resetGame()
{
	if(recTextOn) document.getElementById("gameRecordText").innerHTML= "遊戲紀錄";
	else document.getElementById("gameRecordText").innerHTML= "";
	d3.select("#winnerView").attr("style","z-index: 10;position: absolute; top: 50%;left: 50%;margin: -250px 0 0 -400px; display:None;");
	d3.select("#loserView").attr("style","z-index: 10;position: absolute; top: 50%;left: 50%;margin: -250px 0 0 -400px; display:None;");
	resetPlayerActionAreaUI();
	//para Init
	cardNumbers = [0,0,4,3,3,2,2,2,2,2,2,2,2,2,2];
	cardCostNuts = [0,0,2,3,3,3,3,5,5,5,7,7,7,7,10];
	ownCards = [0,0,0,0,0,0];
	stopRoll = true;
	diceRoll = 0;
	needSelectLoaction = false;
	needRollDice = false;
	needBuyAction = 0;
	nowPlaceCard = 0;
	marketCards = [0,0,0,0,0,0];
	playerNut = 0;
	playerNutPlus = 0;
	round = 1;
	actoinUsed = [false,false,false,false,false,false];
	winGoalOfNutPlus = 7;
	//Init ok

	playerNut = 2;	
	updateRemainCards();	
	setMarketCard();
	updateResourceUI();
	updateMarketUI();
	updateRemainCards();
	d3.select("#roundText").text(round);
	selectLocationSet(1);
}

function endTheGame(win)
{
	needSelectLoaction = false;
	needRollDice = false;
	needBuyAction = 0;
	if(win)
	{
		d3.select("#winnerCostRoundText").text("花了"+round+"回合完成！");
		d3.select("#winnerView").attr("style","z-index: 10;position: absolute; top: 50%;left: 50%;margin: -250px 0 0 -400px;");
	}
	else
	{
		d3.select("#loserView").attr("style","z-index: 10;position: absolute; top: 50%;left: 50%;margin: -250px 0 0 -400px;");
	}
}

function resetPlayerActionAreaUI()
{
	d3.select("#cardInLocation1").attr("href","");
	d3.select("#cardInLocation2").attr("href","");
	d3.select("#cardInLocation3").attr("href","");
	d3.select("#cardInLocation4").attr("href","");
	d3.select("#cardInLocation5").attr("href","");
	d3.select("#cardInLocation6").attr("href","");
}

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
						"href":"./img/cardno"+nowPlaceCard+".svg",
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
				"href":"./img/cardno"+nowPlaceCard+".svg",
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
	d3.select("#rabbitGuide").attr("src","./img/rabbitThin.png");
	d3.select("#hanaGuide").attr("src","./img/guide1.png");	
	roundBeginNut[0]= playerNut;
	roundBeginNut[1]= playerNutPlus;
	rollDiceSet(true);
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
		endTheGame(false);
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
			d3.select("#marketLocation"+(i*1+1)).attr("href","./img/cardno"+marketCards[i]+".svg");
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
	if(playerNutPlus >= winGoalOfNutPlus)
	{
		toastMsg("存到足夠過冬的松果了！恭喜你獲勝！");
		endTheGame(true);
	}
}

function doPlayerAction(actionNo)// actionNo=1~6
{	
	actionNo = actionNo-1;//陣列只有0~5，減一做特別處理	

	d3.select("#doingActionStroke").attr("x",actionNo*200+10).attr("y",10).attr("style","");

	if(actoinUsed[actionNo] == true)
	{
		toastMsg("額外行動無法觸發已執行過的行動(跳過)！");
		updateResourceUI();
		buyActionSet();
		return;
	}
	actoinUsed[actionNo] = true;

	if(ownCards[actionNo]==0)
	{
		playerNut+=2;
		toastMsg("無行動的位置！獲得2顆松果！目前共有"+playerNut+"顆松果。");
		updateResourceUI();
		buyActionSet();
	}	
	if(ownCards[actionNo]==1)
	{
		playerNut+=3;
		toastMsg("獲得3顆松果！目前共有"+playerNut+"顆松果。");
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
			else
			{
				playerNut+=2;
				toastMsg("數量不夠保存！改為獲得2顆松果！目前共有"+playerNut+"顆松果。");
			}
		}
		else
		{
			playerNut+=2;
			toastMsg("取消保存！改為獲得2顆松果！目前共有"+playerNut+"顆松果。");
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
		toastMsg("獲得2顆松果與無視順位加價購買！");
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
	else if(ownCards[actionNo]==8)
	{
		if (confirm("用4顆一般松果執行保存松果的動作？")) 
		{
			if(playerNut>=4)
			{
				playerNutPlus++;
				playerNut-=4;
				toastMsg("獲得1顆保存松果！");
			}
			else
			{
				playerNut+=2;
				toastMsg("數量不夠保存！改為獲得2顆松果！目前共有"+playerNut+"顆松果。");
			}
		}
		else
		{
			playerNut+=2;
			toastMsg("取消保存！改為獲得2顆松果！目前共有"+playerNut+"顆松果。");
		}
		updateResourceUI();
		buyActionSet();
	}
	else if(ownCards[actionNo]==9)
	{
		toastMsg("獲得4顆松果與無視順位加價購買！");
		playerNut+=4;
		updateResourceUI();
		buyActionSet(2);
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
		if (confirm("把7顆一般松果做成2顆保存松果？")) 
		{
			if(playerNut>=7)
			{
				playerNutPlus++;
				playerNutPlus++;
				playerNut-=7;
				toastMsg("獲得2顆保存松果！");
			}
			else
			{
				playerNut+=2;
				toastMsg("數量不夠保存！改為獲得2顆松果！目前共有"+playerNut+"顆松果。");
			}	
		}
		else
		{
			playerNut+=2;
			toastMsg("取消保存！改為獲得2顆松果！目前共有"+playerNut+"顆松果。");
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
			else
			{
				playerNut+=2;
				toastMsg("數量不夠保存！改為獲得2顆松果！目前共有"+playerNut+"顆松果。");
			}
		}
		else
		{
			playerNut+=2;
			toastMsg("取消保存！改為獲得2顆松果！目前共有"+playerNut+"顆松果。");
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
			}
			else
			{
				playerNut+=2;
				toastMsg("數量不夠保存！改為獲得2顆松果！目前共有"+playerNut+"顆松果。");
			}
		}
		else
		{
			playerNut+=2;
			toastMsg("取消保存！改為獲得2顆松果！目前共有"+playerNut+"顆松果。");
		}
		if (confirm("(第二次)用4顆一般松果執行保存松果的動作？")) 
		{
			if(playerNut>=4)
			{
				playerNutPlus++;
				playerNut-=4;
				toastMsg("獲得1顆保存松果！");
			}
			else
			{
				playerNut+=2;
				toastMsg("數量不夠保存！改為獲得2顆松果！目前共有"+playerNut+"顆松果。");
			}
		}
		else
		{
			playerNut+=2;
			toastMsg("取消保存！改為獲得2顆松果！目前共有"+playerNut+"顆松果。");
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
			buyCardInfo[0]=0;
			buyCardInfo[1]=0;
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
			if(needBuyAction==2) cost = cost*1;
			else cost = cost*1 + costPlus[loactionNo-1];
			if(playerNut>=cost)
			{				
				buyCardInfo[0] = cost;
				buyCardInfo[1] = marketCards[loactionNo-1];	
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
	needBuyAction=0;
	d3.select("#hanaGuide").attr("src","./img/guide2.png");
	if(needBuyAction<=0)
	{
		if(recTextOn)
		{
			document.getElementById("gameRecordText").innerHTML= document.getElementById("gameRecordText").innerHTML+
			"<br>"+"Round"+round+
			"：回合開始持有松果:["+roundBeginNut[0]+", "+roundBeginNut[1]+"]"+	
			" | 持有牌編號：["+ownCards+"]"+
			" | 執行行動：[";
			var usedActionList = [];
			for(var i in actoinUsed)
			{
				if(actoinUsed[i])
				{
					usedActionList.push(i);
				}
			}
			for(var i in usedActionList)
			{
				if(usedActionList.length>1)
				{
					document.getElementById("gameRecordText").innerHTML= document.getElementById("gameRecordText").innerHTML+
					"骰出"+(usedActionList[i]*1+1)+" 執行"+ownCards[usedActionList[i]]+"號行動，";
				}
				else
				{
					document.getElementById("gameRecordText").innerHTML= document.getElementById("gameRecordText").innerHTML+
					"骰出"+(usedActionList[i]*1+1)+" 執行"+ownCards[usedActionList[i]]+"號行動";
				} 
			}
			document.getElementById("gameRecordText").innerHTML= document.getElementById("gameRecordText").innerHTML+
			"] | 花費"+buyCardInfo[0]+"松果購買"+buyCardInfo[1]+"號行動"+
			" | 回合結束持有松果:["+playerNut+", "+playerNutPlus+"]";
		}
		
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

function setGameRec()
{
	recTextOn = document.getElementById("gameRecordCheckBox").checked;
}

resetGame();