// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


import './lovehug.css';

const ImageImport  = (id) => {
  return require(`${id}`);
}

const App = () => {
  return (
    <div className='container'>
        <div className='header'>
            <img src={ImageImport('./assets/logo.png')} alt='' className='logo' />
            <p>V3.0.3</p>
        </div>

        <div className='appNotif'>

            {/* <p className='jpLang'>
              以前にプレイストア上のアプリケーションにアクセスできなかったユーザーの場合、
              今、それは使用することができます、プレイストア上の新しいアプリケーションをダウンロードし、ログインしてください、
              すでにwelovemanga.oneのアカウントを持っている人のために
              そうでない場合は、アカウントの作成をクリックしてください, 登録のため、
              アプリ内アカウントは機能せず、その後アプリを再起動します
            </p> */}

            <div className='follow'>Please follow / 下記の手順に従ってください</div>

            <p className='jpLang'>
              下記の手順に従ってください。アプリケーション内のアカウント作成機能は動作しないので、
              使用しないで下さい。以下の <a href='https://kutt.it/register-lovehug' target='_blank' rel="noreferrer">「CREATE ACCOUNT」</a>
              ボタンを押して指示に沿ってアカウントを作りアプリにログインしてください。
              ログインに成功した後はアプリを再起動してください。
            </p>

            <hr/>

            {/* <p className='enLang'>
              Don't register in the application, 
              because it doesn't work, please click <a href='https://kutt.it/register-lovehug' target='_blank' rel="noreferrer">「CREATE ACCOUNT」</a>, 
              follow the instructions, and login to the apps with the account you just created, 
              if you successfully login please restart your apps
            </p> */}

            <p className='enLang'>
            Please follow the steps below. 
            Do not use the account creation functionality within the application as it will not work. 
            Press the <a href='https://kutt.it/register-lovehug' target='_blank' rel="noreferrer">「CREATE ACCOUNT」</a> button below and follow the instructions 
            to create an account and log into the app. 
            After successfully logging in, restart the app.
            </p>

            <p className='enLang'>
              <h4>NOTE VERSION SUPPORT:</h4>
              <h5 style={{
                padding: 0,
                marginTop: 5,
                marginBottom:0,
                fontWeight: 'bold',
              }}>APK : MINIMAL ANDROID 5 / ANDROID LOLLIPOP </h5>
              <h5  style={{
                padding: 0,
                marginTop: 5,
                marginBottom:0,
                fontWeight: 'bold',
              }}>PLAYSTORE : MINIMAL ANDROID 11 / ANDROID Red Velvet Cake </h5>
            </p>
        </div>



        <div className='showBtn'>
            <a className='createAccont' href='https://kutt.it/register-lovehug'>「CREATE ACCOUNT」</a>
            <a className='playStore' href='https://play.google.com/store/apps/details?id=com.lovehug&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'>
              <img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'/>
            </a>
          
            {/* <a className='virusTotal' href='https://www.virustotal.com/gui/file/c787a5e0349f51e6e5b91e2a849daea0867fbc8cdce9c3dec4e547d0bf534f8f?nocache=1'>
                <img alt='virus total' src='https://upload.wikimedia.org/wikipedia/commons/b/b7/VirusTotal_logo.svg' />
            </a> */}
        </div>

        <div className='showBtn'>
            <a className='playStore' href='https://github.com/khalisafkari/lhscan-landing/releases/download/3.0.3/nicomanga.apk'>
              <img style={{ maxHeight: 150 }} alt='Get it on Google Play' src={ImageImport('./assets/apk.png')}/>
            </a>
        </div>

        <div className='showcase'>
            <img src={ImageImport('./assets/001.jpeg')} alt='' />
            <img src={ImageImport('./assets/002.jpeg')} alt='' />
            <img src={ImageImport('./assets/003.jpeg')} alt='' />
            <img src={ImageImport('./assets/004.jpeg')} alt='' />
            <img src={ImageImport('./assets/005.jpeg')} alt='' />
        </div>

        <div className='appDes'>
            <p>Read manga for free, daily updates</p>
        </div>
    </div>
  )
}

export default App;