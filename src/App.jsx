import { useState } from 'react'
import { useEffect } from 'react';
import './App.css'

function App() {

  const defaultState = {
    coupons: 0,
    clicks: 0,
    increasePerClick: 1,
    costPerLevelUpClick: 10,
    passiveIncome: 0,
    costPerLevelUpPassive: 80,
    autoClicksPerSecond: 0,
    costPerLevelUpAuto: 50,
  };

  const [theme, setTheme] = useState("dark");

  const [coupons, setCountCoupons] = useState(() => {
    const saved = localStorage.getItem("gameState");
    return saved ? JSON.parse(saved).coupons : defaultState.coupons;
  });
  // const [coupons, setCountCoupons] = useState(50000000)
  const [clicks, setCountClicks] = useState(() => {
    const saved = localStorage.getItem("gameState");
    return saved ? JSON.parse(saved).clicks : defaultState.clicks;
  });
  // const [clicks, setCountClicks] = useState(0)
  
  const [increasePerClick, setIncreasePerClick] = useState(() => {
    const saved = localStorage.getItem("gameState");
    return saved ? JSON.parse(saved).increasePerClick : defaultState.increasePerClick;
  });
  // const [increasePerClick, setIncreasePerClick] = useState(1)
  const [costPerLevelUpClick, setCostPerLevelUpClick] = useState(() => {
    const saved = localStorage.getItem("gameState");
    return saved ? JSON.parse(saved).costPerLevelUpClick : defaultState.costPerLevelUpClick;
  });
  // const [costPerLevelUpClick, setCostPerLevelUpClick] = useState(10)
  
  const [passiveIncome, setPassiveIncome] = useState(() => {
    const saved = localStorage.getItem("gameState");
    return saved ? JSON.parse(saved).passiveIncome : defaultState.passiveIncome;
  });
  // const [passiveIncome, setPassiveIncome] = useState(0)
  const [costPerLevelUpPassive, setCostPerLevelUpPassive] = useState(() => {
    const saved = localStorage.getItem("gameState");
    return saved ? JSON.parse(saved).costPerLevelUpPassive : defaultState.costPerLevelUpPassive;
  });
  // const [costPerLevelUpPassive, setCostPerLevelUpPassive] = useState(80)
  
  const [autoClicksPerSecond, setAutoClicksPerSecond] = useState(() => {
    const saved = localStorage.getItem("gameState");
    return saved ? JSON.parse(saved).autoClicksPerSecond : defaultState.autoClicksPerSecond;
  });
  // const [autoClicksPerSecond, setAutoClicksPerSecond] = useState(0);
  const [costPerLevelUpAuto, setCostPerLevelUpAuto] = useState(() => {
    const saved = localStorage.getItem("gameState");
    return saved ? JSON.parse(saved).costPerLevelUpAuto : defaultState.costPerLevelUpAuto;
  });
  // const [costPerLevelUpAuto, setCostPerLevelUpAuto] = useState(50)
  
  const [clickEffect, setClickEffect] = useState(null);
  
  const handleClick = (event) => {
    // console.log(event.clientX, event.clientY);
    setCountCoupons((coupons) => coupons + increasePerClick);
    setCountClicks((clicks) => clicks + 1);

    // coordinates for the ripple effect
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setClickEffect({ x, y });
    setTimeout(() => setClickEffect(null), 200);
  }

  const handleIncreasePerClick = () => {
    if (coupons - costPerLevelUpClick < 0) { return; }
    setCountCoupons((coupons) => coupons - Math.floor(costPerLevelUpClick))
    setIncreasePerClick((increasePerClick) => (increasePerClick + 1) * 1.2)
    setCostPerLevelUpClick((price) => price * 1.5)
  }
  
  const handlePassiveIncrease = () => {
    if (coupons - costPerLevelUpPassive < 0) { return; }
    setCountCoupons((coupons) => coupons - Math.floor(costPerLevelUpPassive))
    setPassiveIncome((passiveIncome) => Math.ceil((passiveIncome + 1) * 1.3))
    setCostPerLevelUpPassive((price) => price * 1.4)
  }
  
  const handleAutoClickIncrease = () => {
    if (coupons - costPerLevelUpAuto < 0) { return; }
    setCountCoupons((coupons) => coupons - Math.floor(costPerLevelUpAuto))
    setAutoClicksPerSecond((autoClicksPerSecond) => autoClicksPerSecond + 1)
    setCostPerLevelUpAuto((price) => price * 1.3)
  }
  
  // passive income every second
  useEffect(() => {
    if (passiveIncome <= 0) return;

    const interval = setInterval(() => {
      setCountCoupons(coupons => coupons + passiveIncome);
    }, 1000);

    return () => clearInterval(interval);
  }, [passiveIncome]);

  // auto clicks 'autoClicksPerSecond' times per second
  useEffect(() => {
    if (autoClicksPerSecond <= 0) return;

    const interval = setInterval(() => {
      setCountCoupons((coupons) => coupons + increasePerClick);
      setCountClicks((clicks) => clicks + 1);
    }, 1000 / autoClicksPerSecond);

    return () => clearInterval(interval);
  }, [autoClicksPerSecond, increasePerClick])

  // loading from local storage
  useEffect(() => {
    console.log("storage load")
    const savedState = localStorage.getItem("gameState");
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setCountCoupons(parsed.coupons);
      setCountClicks(parsed.clicks);
      setIncreasePerClick(parsed.increasePerClick);
      setCostPerLevelUpClick(parsed.costPerLevelUpClick);
      setPassiveIncome(parsed.passiveIncome);
      setCostPerLevelUpPassive(parsed.costPerLevelUpPassive);
      setAutoClicksPerSecond(parsed.autoClicksPerSecond);
      setCostPerLevelUpAuto(parsed.costPerLevelUpAuto);
    }
  }, []);

  // saving to local storage on any change (cooldown every second)
  useEffect(() => {
    console.log("storage")
    const state = {
      coupons,
      clicks,
      increasePerClick,
      costPerLevelUpClick,
      passiveIncome,
      costPerLevelUpPassive,
      autoClicksPerSecond,
      costPerLevelUpAuto,
    };
    localStorage.setItem("gameState", JSON.stringify(state));
  }, [coupons, clicks, increasePerClick, costPerLevelUpClick, passiveIncome, costPerLevelUpPassive, autoClicksPerSecond, costPerLevelUpAuto]);

  const resetGame = () => {
    localStorage.removeItem("gameState");
    setCountCoupons(defaultState.coupons);
    setCountClicks(defaultState.clicks);
    setIncreasePerClick(defaultState.increasePerClick);
    setCostPerLevelUpClick(defaultState.costPerLevelUpClick);
    setPassiveIncome(defaultState.passiveIncome);
    setCostPerLevelUpPassive(defaultState.costPerLevelUpPassive);
    setAutoClicksPerSecond(defaultState.autoClicksPerSecond);
    setCostPerLevelUpAuto(defaultState.costPerLevelUpAuto);
  };

  
  return (
    <>
      <div className={`everything ${theme}`}>

        <div className='clicker_main_cont' >
          <button className='clicker_main_area' onClick={handleClick}>
            <h2>{Math.floor(coupons).toLocaleString("en-US")}<span className='coupons_sign'>K</span></h2>
            <p className='info_title'>Піти на вилазку</p>
            {clickEffect && (
              <span
              className="click-effect"
              style={{ left: clickEffect.x, top: clickEffect.y }}
              />
            )}
          </button>
        </div>

        <div className='info_area_1'>
          <div className='info_elem'>
            <p className='info_title'>Купонів за вилазку</p>
            <h2>{Math.floor(increasePerClick).toLocaleString("en-US")}<span className='coupons_sign'>K</span></h2>
          </div>
          <div className='info_elem'>
            <p className='info_title'>Всього вилазок проведено</p>
            <h2>{clicks}</h2>
          </div>
        </div>

        <div className='upgrades_area'>
          <div className='upgrade_elem'>
            <button onClick={handleIncreasePerClick} className='button_upgrade'>
              <div className='upgrade_container_upper'>
                <p className='upgrade_title'>Покращити спорядження: {Math.floor(increasePerClick).toLocaleString("en-US")}</p>
                <p className='upgrade_price'>Ціна: {Math.floor(costPerLevelUpClick).toLocaleString("en-US")}<span className='coupons_sign'>K</span></p>
              </div>
              <p className='upgrade_desc'>Купити нову спорягу і збільшити прибуток за вилазку у 1.2<span className='coupons_sign'>K</span> раза</p>
            </button>
          </div>

          <div className='upgrade_elem'>
            <button onClick={handlePassiveIncrease} className='button_upgrade'>
              <div className='upgrade_container_upper'>
                <p className='upgrade_title'>Відкрити бізнес: {passiveIncome.toLocaleString("en-US")}<span className='coupons_sign'>K</span>/сек</p>
                <p className='upgrade_price'>Ціна: {Math.floor(costPerLevelUpPassive).toLocaleString("en-US")}<span className='coupons_sign'>K</span></p>
              </div>
              <p className='upgrade_desc'>Відкрити ще одну точку продажів в зоні і збільшити прибуток за секунду у 1.3<span className='coupons_sign'>K</span> раза</p>
            </button>
          </div>

          <div className='upgrade_elem'>
            <button onClick={handleAutoClickIncrease} className='button_upgrade'>
              <div className='upgrade_container_upper'>
                <p className='upgrade_title'>Найняти бандитів: {autoClicksPerSecond.toLocaleString("en-US")}</p>
                <p className='upgrade_title'>Ціна: {Math.floor(costPerLevelUpAuto).toLocaleString("en-US")}<span className='coupons_sign'>K</span></p>
              </div>
              <p className='upgrade_desc'>Підняти свій статус пахана і найняти бандитів які роблять +1 вилазку кожну секунду</p>
            </button>
          </div>
        </div>
        <p>Зміна теми</p>
        <div className="theme-switcher">
          <button className='button_1' onClick={() => setTheme("light")}>Світла</button>
          <button className='button_1' onClick={() => setTheme("dark")}>Темна</button>
          <button className='button_1' onClick={() => setTheme("purple_dark")}>Фіолетова</button>
          <button className='button_1' onClick={() => setTheme("green_light")}>Зелена</button>
        </div>
        <button className='button_1' onClick={() => setCountCoupons((coupons) => coupons + 50000000)}>Активувати подарунковий код [+50млн<span className='coupons_sign'>K</span>]</button>
        <button className='button_1' onClick={resetGame}>Скинути прогрес</button>
      </div>
    </>
  )
}

export default App