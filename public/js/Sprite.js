class Sprite{ // sprite 클래스 선언
	/*
		imageInfo
			: frame_count
			: width
			: height
			: sX
			: sY
			: frame_direction(right or bottom)
			: ani_time
			: update_time
			: dX
			: dY
			: last_frame
	*/
	constructor(src,imageInfo){ //생성자 constructor선언 / 파라메터(src,imageInfo)
		if(typeof src=="object"){// src 변수의 값이 객체인지 확인
			imageInfo=src;//TRUE 일때 
			src=imageInfo.src;//
			if(!src){//false
				return;//리턴
			}
		}

		var index;//인덱스 변수 선언
		this.mWidth=imageInfo.width;//imageInfo의 width값 mWidth 선언및 초기화
		this.mHeight=imageInfo.height;//imageInfo의 height값 mheight 선언및 초기화
		if((index=checkAleadyRecource(src)) !== false){//index변수와 checkAleadyRecource(src)함수 비교 , 결과값은 false와 비교
			this.mData = Resources_List[index];//mData Resources_List[i]값 저장
			this.mWidth= imageInfo.width || this.mData.width;//mWidth = imageInfo.width 값 and mData.width값저장
			this.mHeight= imageInfo.height || this.mData.height;//mHeight = imageInfo.height 값 and mData.height값저장
		}else{//false가 아닐때
			this.mData = new Image();//mData 값에 Image 객체생성
			this.mData.src = src;//mData.src = src값저장
			this.mData.tSrc= src;//mData.tSrc = src값 저장

			Resources_List.push(this.mData);//Resources_List함수안에 mData 값 추가
			
			var th=this; // th변수에 this 지정

			this.mData.onload=function(){ // mData.onload에 
				th.mWidth =imageInfo.width || this.width; //mWidth = imageInfo.width || this.width 선언및초기화
				th.mHeight=imageInfo.height || this.height;//mHeight = imageInfo.height || this.height 선언및초기화
			};
		}
		this.mOldAniTime=(new Date()).getTime();//mOldAniTime 현재시간객체생성및현재시간초기화
		this.mAniTime=imageInfo.ani_time || 100;//mAniTime=imageInfo.ani_time || 100; 값 선언및초기화

		this.mOldUpdateTime=(new Date()).getTime();//mOldUpdateTime 현재시간객체생성및현재시간초기화
		this.mUpdateTime=imageInfo.update_time || 10;//mUpdateTime=imageInfo.update_time || 10 값 선언및초기화

		this.mIndex = 0;//mIndex 0으로 선언및 초기화
		
		//mCount 가 0 일 경우도 포함.
		this.mCount = !isNaN(imageInfo.frame_count) ? imageInfo.frame_count : 1;
		/*삼항연산자 mCount = isNan함수사용 (imageInfo.frame_count)값이 숫자가아닌값
		true 일때 1 로 초기화,
		false일때 imageInfo.frame_count*/

		this.mSx=imageInfo.sX || 0;//mSx=imageInfo.sX || 0; msx 값초기화
		this.mSy=imageInfo.sY || 0;//mSy=imageInfo.sY || 0; msy 값초기화

		switch(imageInfo.frame_direction){//스위치 조건문선언 파라메터 imageInfo 객체의 frame_direction 값 입력)
			case "left": 
				this.mDirX=-1;
				this.mDirY=1;
				break;
				// 왼쪽 눌렀을때 mDirX 값 -1,mDirY 값 1
			case "bottom":
				this.mDirX=0;
				this.mDirY=1;
				break;
				// 아래쪽 눌렀을때 mDirX 값 0,mDirY 값 1	
			case "top":
				this.mDirX=0;
				this.mDirY=-1;
				break;
				// 위쪽 눌렀을때 mDirX 값 0,mDirY 값 -1
			default:
			case "right":
				this.mDirX=1;
				this.mDirY=0;
				break;
				// 오른쪽 눌렀을때 mDirX 값 1,mDirY 값 0
		}

		this.mDx=imageInfo.dX || 0; //mDx값에 mDx=imageInfo.dX || 0; 초기화및선언
		this.mDy=imageInfo.dY || 0; //mDy값에 mDx=imageInfo.dY || 0; 초기화및선언

		//pixel/sec
		this.mVx=imageInfo.vX || 0; //mVx값에 mDx=imageInfo.vX || 0; 초기화및선언
		this.mVy=imageInfo.vY || 0; //mVy값에 mDx=imageInfo.vY || 0; 초기화및선언

		//가속도
		this.mAx=imageInfo.aX || 0; //mAx값에 mDx=imageInfo.aX || 0; 초기화및선언
		this.mAy=imageInfo.aY || 0; //mAy값에 mDx=imageInfo.aY || 0; 초기화및선언

		this.mLastFrame=imageInfo.last_frame || undefined; // mLastFrame변수에 imageInfo.last_frame || undefined;
		
		this.mTimer=null;//mTimer 변수 null 초기화
		this.mTimerOldTime=(new Date()).getTime(); // mTimerOldTime 변수 현재시간으로 초기화

		this.currentTime=(new Date()).getTime(); // currentTime 변수 현재시간으로 초기화
		if(Array.isArray(imageInfo.geometry)){ 
			//Array.isArray() 메서드는 imageInfo.geometry 배열이면  true, 그렇지 않으면 false 를 반환한다.
			this.geometry=imageInfo.geometry;//배열일때 geometry변수에 imageInfo.geometry초기화
		}
		this.mOnUpdate=imageInfo.onupdate;//mOnUpdate 변수 imageInfo.onupdate 객체 값으로 선언및초기화
	}
	UpdateFrame(newTime){ // UpdateFrame함수 newTime 변수 파라메터로 선언
		this.currentTime-=newTime; //currentTime 변수 x=x-y , currentime = currentime-newTime;
		if(newTime-this.mOldAniTime >= this.mAniTime){//newTime-newTime 결과값이 mAniTime값보다 크거나 같을때
			this.mOldAniTime=newTime; //mOldAniTime값에 newTime의 값으로 선언및초기화
			if(this.mCount != 0){ //첫번째조건이 true 일때 실행, mCount 0이 아닐때
				this.mIndex=++this.mIndex%this.mCount; //mIndex 값을 후연산한 mIndex나머지mCount값으로 초기화
				if(this.mIndex==0 && typeof this.mLastFrame=="function"){ //mIndex 0 이거나 mLastFrame값이 함수일때
					this.mLastFrame(); //mLastFrame 함수실행
				}

			}
		}
		if(newTime-this.mOldUpdateTime >= this.mUpdateTime){//newTime-mOldUpdateTime 결과값이 mUpdateTime값보다 크거나 같을때
			this.mOldUpdateTime=newTime;	//mOldUpdateTime값을 newTime 으로 초기화및선언
			this.mDx+=this.mVx/1000*this.mUpdateTime;//mDx = mDx + mVx/1000*mUpdateTime
			this.mDy+=this.mVy/1000*this.mUpdateTime;//mDy = mDy + mVy/1000*mUpdateTime

			this.mVx+=this.mAx/1000*this.mUpdateTime;//mVx = mVx + mAx/1000*mUpdateTime
			this.mVy+=this.mAy/1000*this.mUpdateTime;//mVy = mVy + mAy/1000*mUpdateTime
			if(typeof this.mOnUpdate=="function"){//mOnUpdate 값이 함수일때
				this.mOnUpdate();//mOnUpdate 함수실행
			}
		}
		if(this.mCount!=0 && this.mTimer){//mCount 0이아니거나 mTimer 일때
			if(this.mTimer.delay<=newTime-this.mTimerOldTime){//newTime-this.mTimerOldTime값이 mTimer.delay보다크거나같을때
				this.mTimerOldTime=newTime;//mTimerOldTime 변수 newTime값으로 초기화
				this.mTimer.callback();//mTimer callback()함수 실행
			}
		}
	}
	Draw(){//Draw 함수선언
		if(this.mCount===0){//mCount 객체의 타입이 0 일때
			return false;//false 리턴
		}
		c.drawImage(this.mData,
					this.mSx+this.mIndex*this.mWidth*this.mDirX,  //sx
					this.mSy+this.mIndex*this.mHeight*this.mDirY, //sy
					this.mWidth, //swidth
					this.mHeight,//sheight
					this.mDx,
					this.mDy,
					this.mWidth,
					this.mHeight
					);
		//9개 파라메터 c.drawImage 함수에 전달)
	}
	ReleaseTimer(){//ReleaseTimer 함수실행
		this.mTimer=null;//mTimer=null값으로 선언및 초기화
	}
}

function checkAleadyRecource(src){//checkAleadyRecource(src) 파라미터로 선언
	for(var i=0; i<Resources_List.length; i++){//Resources_List.length 만큼 반복문 실행
		if(Resources_List[i].tSrc==src || Resources_List[i].src==src){
			//Resources_List[i].tSrc==src 이거나 Resources_List[i].src==src 일때
			return i;//i번째 리턴
		}
	}
	return false;//반복문 종료후 false 리턴
}
var Resources_List=new Array();//Resources_List 배열 생성