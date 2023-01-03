import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css'; // Add this line to import your CSS file
import { initializeApp} from "firebase/app";
import "firebase/firestore";
import { getFirestore, collection, getDocs, onSnapshot} from "firebase/firestore";
import { useSpring, animated } from 'react-spring';
import { getDatabase, ref, onValue  } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const database = getDatabase(app);
const buttonTextRef = ref(database,'Quotes/');


function App() {
  const [setQuotes] = useState([]);
  const [quote, setQuote] = useState('');
   const [gradient, setGradient] = useState('');
   const [bText, setText] = useState([]);
   const [bTexts, setTexts] = useState('');

  const breathProps = useSpring({
    from: { opacity: 1 },
    to: async next => {
      while (true) {
        await next({ opacity: 0.7 });
        await next({ opacity: 1 });
      }
    },
    config: { duration: 1000 }, // Adjust the duration of the animation here

  });
  const divRef = useRef(null); // Create a ref for the div element

  //make sign variable change color onclick
  const [sign, setSign] = useState('');


  function updateButtonText() {
    if (bTexts === '') {
      setTexts('Hi Farid, make me smile :)');
    } else {
      setTexts(bTexts);
    }
  }

  useEffect(() => {
    updateButtonText();
  }, [bTexts]);


  useEffect(() => {
    async function fetchData() {
      // Fetch all quotes from the "Quotes" collection in one go
      const querySnapshot = await onSnapshot(collection(db, "Quotes"));
      const quotesArray = querySnapshot.docs.map(doc => ({ quote: doc.data().Quote, author: doc.data().Author }));
      setQuotes(quotesArray);
    }
    fetchData();
      onValue(buttonTextRef, snapshot => {

            const bText = snapshot.val();
      
            setText(bText);
      
          });
  }, []);

  const handleClick = async () => {
    // Get the quotes from the Firestore collection
    const querySnapshot = await getDocs(collection(db, "Quotes"));
    const quotesArray = querySnapshot.docs.map(doc => ({ quote: doc.data().Quote, author: doc.data().Author }) );
    setSign("~");
    // Ignore empty quotes and authors
const nonEmptyQuotes = quotesArray.filter(quoteObj => quoteObj.quote.trim().length > 0 && quoteObj.author.trim().length > 0);

// Remove quotation marks and extra quotation marks
const cleanQuotes = nonEmptyQuotes.map(quoteObj => ({ 
  quote: quoteObj.quote.replace(/['"]+/g, '').trim(), 
  author: quoteObj.author.replace(/['"]+/g, '').trim() 
}));

// Ignore quotes where quote and author have the same value
const uniqueQuotes = cleanQuotes.filter(quoteObj => quoteObj.quote !== quoteObj.author);

// Pick a random quote from the unique quotes array
const randomIndex = Math.floor(Math.random() * uniqueQuotes.length);
const { quote, author } = uniqueQuotes[randomIndex];
setQuote({ quote, author });



    
      
//Button text random//
    const nonEmptyButtonText= bText.filter(bTexts => bTexts.trim().length > 0);

    if (nonEmptyButtonText.length > 0) {
    
      // Select a random quote from the non-empty quotes array
    
      const randomIndextext = Math.floor(Math.random() * nonEmptyButtonText.length);
    
      const randombuttonText= nonEmptyButtonText[randomIndextext];
    
      setTexts(randombuttonText);
    
    }

//change colour of text when button is clicked


  


      // Generate a random gradient background
        const baseColors = ['#fe6b8b', '#ff8e53', '#ffa94d', '#f7e7ce', '#6699CC', "#add8e6", "#87ceeb",
      "#87cefa",
      "#00bfff",
      "#1e90ff",
      "#6495ed",
      "#ffffe0",
      "#fffacd",
      "#fff8dc",
      "#f5f5f5",
      "#fff0f5",
      "#dcdcdc", '#90EE90', '#98FB98', '#66CDAA', '#3CB371', '#20B2AA', '#8FBC8F', '#00FA9A'
    
        ];
      
      

    const color1Index = Math.floor(Math.random() * baseColors.length);

    const color2Index = Math.floor(Math.random() * baseColors.length);

    const color1 = baseColors[color1Index];

    const color2 = baseColors[color2Index];

    const start = Math.floor(Math.random() * 100);

    const end = Math.floor(Math.random() * 100);
    const grad= Math.floor(Math.random() * 50);

    const gradient = `linear-gradient(${grad}deg, ${color1} ${start}%, ${color2} ${end}%)`;

    divRef.current.style.background = gradient;

setGradient(gradient);

};
      //write a code to make a ball bounce//
      return (

          <div className="justify-content-center haziq" style={{ fontSize: '24px', width: '100%', height: '100%', }}>
   <animated.div ref={divRef} style={{
  position: 'relative',
  minHeight: '10.25rem',
  width: '100%',
  marginBottom: '0',
  marginTop: '5.375rem',
  background: gradient,
  ...breathProps
}}>
  <div style={{  position: 'relative',
    fontSize: '32px',
    fontWeight: 'bold',
    fontFamily: "'Montserrat', arial"}}>
    <p className="text-center">{quote.quote}</p>
  </div>
</animated.div>
<p className="text-center-haziq" style={{ position: 'relative',
  fontSize: '25px',
  fontStyle: 'Italic',
  fontWeight: 'bold',
  opacity:'0.5',
  textAlign: 'center',
    fontFamily: "EB Garamond"}}>
    {sign} {quote.author}</p>
                <button value className="btn btn-primary mx-auto d-block" style={{
                  position: 'relative',    
                  fontSize: '20px',
                  fontWeight: 'bold',
                  maxWidth: '500px',
                  height: '50px',
                  wordWrap: 'break-word',
                  marginTop:'1.875rem',
                  fontFamily: "'Montserrat', arial"
                }} onClick={handleClick}>
                  {bTexts}
                  TEXT ENV
                </button>
   
          </div>

  );
}

export default App;      