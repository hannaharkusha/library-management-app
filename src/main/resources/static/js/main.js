let user_id = null;
let user_type = null;
let daily_cost = 0.1;

document.addEventListener("DOMContentLoaded", function () {
    const savedState = loadState();
    applyState(savedState);
    // Setup for Sieć bibliotek click
    let siecBibliotekDiv = document.querySelector(".logo");
    siecBibliotekDiv.addEventListener("click", function () {
        console.log("Logo clicked!");
        // Restore default content
        let additionalDiv1 = document.querySelector(".additional-div1");
        additionalDiv1.classList.remove("flex-container-row");
        additionalDiv1.classList.remove("additional-scroll");
        additionalDiv1.classList.remove("acc-page");

        additionalDiv1.innerHTML = `
            <div id="slideshow" class="slider-container">
               <button class="prev">&#10094;</button>
        <div class="slides">
            <img src="images/slide1.jpg" class="Rectangle4 slide1" alt="slide1"/>
           <div class="Rectangle5">Filia Czyżyny w końcu otwarta!</div>
        </div>
        <div class="slides">
            <img src="images/slide2.jpg" class="Rectangle4 slide2" alt="slide2"/>
            <div class="Rectangle5">"Statystyczny Polak" jednak czyta</div>
        </div>
        <div class="slides">
            <img  src="images/slide3.jpg" class="Rectangle4 slide3" alt="slide3" />
            <div class="Rectangle5">Nowości w katalogu</div>
        </div>
        <div class="slides">
            <img src="images/slide4.jpg" class="Rectangle4 slide4" alt="slide4" />
            <div class="Rectangle5">Bronowicki Klub Książki</div>
        </div>
        <div class="Rectangle3 slides">
            <img src="images/slide5.jpg" class="Rectangle4 slide5" alt="slide5"/>
            <div class="Rectangle5">Kampania "Zima z książką"</div>
        </div>
        <button class="next">&#10095;</button>
            </>
        `;
        // Reinitialize slideshow and login button functionality
        initializeSlideshow();
        initializeLoginButton();
    });

    function getLibraryDataById(libraryId) {
        return getLibrariesData()
            .then(libraries => {
                const selectedLibrary = libraries.find(library => library.id === libraryId);

                if (selectedLibrary) {
                    console.log("Dane dla biblioteki o ID", libraryId, ":", selectedLibrary);
                    return selectedLibrary; // Zwraca dane znalezionej biblioteki
                } else {
                    console.error("Nie znaleziono biblioteki o ID", libraryId);
                    throw new Error("Nie znaleziono biblioteki o podanym ID");
                }
            })
            .catch(error => {
                console.error('Błąd podczas pobierania danych o bibliotekach:', error);
                throw error;
            });
    }

    let kontaktPage = document.querySelector(".kontakt");
    kontaktPage.addEventListener("click", function () {
        // Create overlay div
        let overlayDiv = document.createElement("div");
        overlayDiv.classList.add("overlay");

        // Prompt content with header and location options
        let contentDiv = document.createElement("div");
        contentDiv.classList.add("overlay-content");
        contentDiv.innerHTML = `
    <h2>Wybierz filię</h2>
    <div class="location-list">
        <div class="selected-location">
            Wybierz z listy <i class="fa-solid fa-caret-down"></i>
        </div>
        <div class="all-locations">
            <div data-location="Czyżyny">Filia Czyżyny</div>
            <div data-location="Śródmieście">Filia Śródmieście</div>
            <div data-location="Bronowice">Filia Bronowice</div>
            <div data-location="Grzegórzki">Filia Grzegórzki</div>
            <div data-location="Krowodrza">Filia Krowodrza</div>
        </div>
    </div>
`;

        overlayDiv.appendChild(contentDiv);
        document.body.appendChild(overlayDiv);

        let selectedLocation = contentDiv.querySelector(".selected-location");
        let allLocations = contentDiv.querySelector(".all-locations");

        allLocations.style.display = "none";
        selectedLocation.addEventListener("click", function () {
            if (allLocations.style.display === "block") {
                allLocations.style.display = "none";
            } else {
                allLocations.style.display = "block";
            }
        });

        // Add event listener for location selection
        allLocations.addEventListener("click", function (event) {
            if (event.target.dataset.location) {
                let selectedLocation = event.target.dataset.location;
                // Handle the selected location, e.g., open another overlay
                openLocationOverlay(selectedLocation);
            }
        });

// Function to get libraryID based on the selected location
        function getLibraryID(selectedLocation) {
            // You can customize this function based on your specific logic
            // For now, let's assume a simple mapping where the first location has libraryID 1, the second has libraryID 2, and so on.
            const locationList = Array.from(allLocations.children);
            const index = locationList.findIndex(locationElement => locationElement.dataset.location === selectedLocation);

            // Adding 1 to index to get libraryID (assuming indexing starts from 0)
            return index + 1;
        }

        overlayDiv.addEventListener("click", function (event) {
            if (!contentDiv.contains(event.target)) {
                overlayDiv.remove();
            }
        });

        // Function to open another overlay based on the selected location
        function openLocationOverlay(location) {
            contentDiv.remove();
            // Create and display another overlay with location-specific content
            let locationOverlayDiv = document.createElement("div");
            locationOverlayDiv.classList.add("overlay-content-column");

            let selectedLocation = event.target.dataset.location;
            let libraryID = getLibraryID(selectedLocation);

            // Fetch opening data and library data concurrently
            Promise.all([fetchLibraryOpeningData(libraryID), getLibraryDataById(libraryID)])
                .then(([openingsData, libraryData]) => {
                    // Handle opening data
                    let openingsList = openingsData.map(openingArray => {
                        if (openingArray && openingArray.length > 0) {
                            let opening = openingArray[0];
                            if (opening.day && opening.openHour && opening.closeHour) {
                                return `<li>${opening.day}: ${opening.openHour} - ${opening.closeHour}</li>`;
                            } else {
                                console.log("Nieprawidłowe dane otwarcia:", opening);
                                return "<li>Nieprawidłowe dane otwarcia</li>";
                            }
                        } else {
                            console.log("Nieprawidłowe dane otwarcia: brak danych");
                            return "<li>Nieprawidłowe dane otwarcia</li>";
                        }
                    }).join('');

                    // Create an unordered list and append each opening time as a list item
                    let modalList = document.createElement('ul');
                    modalList.innerHTML = openingsList;
                    locationOverlayDiv.innerHTML = `<h2>Godziny otwarcia biblioteki ${location}</h2>`;
                    locationOverlayDiv.appendChild(modalList);

                    // Handle library data
                    let libraryDataDiv = document.createElement("div");
                    libraryDataDiv.innerHTML = `
                <h2>Dane kontaktowe:</h2>
                <p>Adres: ${libraryData.location}</p>
                <p>Numer telefonu: ${libraryData.phoneNum}</p>
            `;
                    locationOverlayDiv.appendChild(libraryDataDiv);

                    // Add the constructed locationOverlayDiv to the overlayDiv
                    overlayDiv.appendChild(locationOverlayDiv);
                })
                .catch(error => {
                    console.error("Błąd:", error);
                });
        }
    });

    let katalog = document.getElementById("katalog");
    katalog.addEventListener("click", function () {
        // Fetch book data and update additionalDiv1 when "Katalog" is clicked
        fetchBookData();
    });

    let slideIndex = 0;
    function showSlides() {
        let slides = document.getElementsByClassName("slides");
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }

        if (slideIndex >= slides.length) {
            slideIndex = 0;
        }

        if (slideIndex < 0) {
            slideIndex = slides.length - 1;
        }

        slides[slideIndex].style.display = "block";
    }

    function initializeSlideshow() {
        slideIndex = 0;
        showSlides();

        let nextButton = document.querySelector(".next");
        let prevButton = document.querySelector(".prev");

        nextButton.addEventListener("click", function () {
            slideIndex++;
            showSlides();
        });

        prevButton.addEventListener("click", function () {
            slideIndex--;
            showSlides();
        });
    }
    initializeSlideshow();

    function initializeLoginButton() {
        let loginButton = document.getElementById("loginButton");
        loginButton.addEventListener("click", function () {
            if(user_id){
                showAccPage();
            }
            else {
                let additionalDiv1 = document.querySelector(".additional-div1");
                additionalDiv1.innerHTML = '';
                additionalDiv1.classList.remove("additional-scroll");
                additionalDiv1.classList.remove("acc-page");
                additionalDiv1.classList.add("flex-container-row");

                // Add the first div with the login form
                let loginFormDiv = document.createElement("div");
                loginFormDiv.classList.add("login-form-container");
                loginFormDiv.innerHTML = `
                <h2>Zaloguj się do swojego konta:</h2>
                <input type="email" id="email" name="login" required placeholder="Email">

                <input type="password" id="passwordLog" name="password" required placeholder="Hasło">

                <button type="submit" id="submitButton">Zaloguj</button>
        `;
                additionalDiv1.appendChild(loginFormDiv);

                // Add the second div with two links
                let linkContainer = document.createElement("div");
                linkContainer.classList.add("link-container");

                let link0 = document.createElement("div");
                link0.innerHTML = `<img src="images/login-image.png" alt="login-image">`;

                let link1 = document.createElement("div");
                link1.innerHTML = `
                <div id="resetPass">Odzyskaj hasło <i class="fa-solid fa-arrow-right"></i></div>
                `;
                link1.classList.add("forgot-password-link");

                let link2 = document.createElement("div");
                link2.innerHTML = `
                <div id = "signup">Załóż konto <i class="fa-solid fa-arrow-right"></i></div>`;
                link2.classList.add("registration-link"); // Add the class for the registration link

                linkContainer.appendChild(link0);
                linkContainer.appendChild(link1);
                linkContainer.appendChild(link2);
                additionalDiv1.appendChild(linkContainer);

                initializeZalogujButton();

                let forgotPasswordLink = document.getElementById("resetPass");
                forgotPasswordLink.addEventListener("click", function () {
                    //let additionalDiv1 = document.querySelector(".additional-div1");
                    let overlay = document.createElement("div");
                    overlay.classList.add("overlay");
                    let overlayC = document.createElement("div");
                    overlayC.classList.add("overlay-content-column");
                    document.body.appendChild(overlay);
                    overlay.appendChild(overlayC);
                    overlayC.innerHTML = `
                    <div class="registration-form">
                        <h2>Odzyskaj swoje hasło:</h2>
                        <div class="sections">
                            <div class="section">
                                <label for="emailPass" >Email</label>
                                <input type="text" id="emailPass" name="emailPass" required>
                
                                <label for="forgotPassword" style="font-size: 16px;">Hasło</label>
                                <input type="password" id="forgotPassword" name="forgotPassword" required>
                
                                <label for="confirmPassword" style="font-size: 16px;">Powtórz hasło</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" required>
                            </div>
                        </div>
                        <button type="submit" id="passButton">Potwierdź</button>
                    </div>
                `;
                    overlay.addEventListener("click", function (event) {
                        if (!overlayC.contains(event.target)) {
                            overlay.remove();
                        }
                    });
                    initializePassButton();
                });

                let registerLink = document.getElementById("signup");
                registerLink.addEventListener("click", function () {
                    let overlay = document.createElement("div");
                    overlay.classList.add("overlay");
                    let overlayC = document.createElement("div");
                    overlayC.classList.add("overlay-content-column");
                    document.body.appendChild(overlay);
                    overlay.appendChild(overlayC);
                    overlayC.innerHTML = `
                <div class="registration-form">
                  <h2>Zarejestruj się:</h2>
                  <div class="sections">
                  <div class="section">
                  <label for="name">Imię</label>
                  <input type="text" id="name" name="name" required>

                  <label for="lastName">Nazwisko</label>
                  <input type="text" id="lastName" name="lastName" required>

                  <label for="password">Hasło</label>
                  <input type="password" id="passwordRegister" name="password" required>
                  </div>
                   <div class="section">
                  <label for="numerTelefonu">Numer telefonu:</label>
                    <input type="tel" id="numerTelefonu" name="numerTelefonu" pattern="[0-9]{9}" required>

                    <label for="email">Email:</label>
                        <input type="email" id="emailRegister" name="email" required>
                  </div>
									</div>
                  <button type="submit" id="registerButton">Register</button>
                </div>
              `;
                    overlay.addEventListener("click", function (event) {
                        if (!overlayC.contains(event.target)) {
                            overlay.remove();
                        }
                    });
                    initializeRegisterButton();
                });
            }
            initializeSlideshow();
            initializeLoginButton();
            initializeZalogujButton();
        });
    }
    initializeLoginButton();

    function initializeZalogujButton() {
        let submitButton = document.getElementById("submitButton");
        submitButton.addEventListener("click", function (event) {
            event.preventDefault();
            submitButtonClick();
        });
    }
    initializeZalogujButton();

    function fetchUserId(email, pass) {
        fetch(`/api/account/login?email=${email}&password=${pass}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data) {
                   // let objectName;
                    user_id = data.id;
                    console.log(data.id);

                    if(email.includes('@employee')){
                        user_type="emp";
                    }
                    else if(email.includes('@admin')){
                        user_type="adm";
                        user_id="adm";
                    }
                    else {
                        user_type="reader";
                    }

                    showAccPage();
                    console.log(user_type,user_id);
                } else {
                    prompt("Nie ma konta o podanych danych!")
                    console.log('Nie znaleziono konta o podanym adresie email.');
                }
            })
            .catch(error => {
                alert("Nie ma konta o podanych danych!")
                console.error('Error fetching account data:', error);
            });
    }

    function submitButtonClick() {

        let email = document.getElementById("email").value;
        let password= document.getElementById("passwordLog").value;

        fetchUserId(email, password);
    }

    function showAccPage(){
        console.log(user_type, user_id);

        let additionalDiv1 = document.querySelector(".additional-div1");
        additionalDiv1.innerHTML = '';

        additionalDiv1.classList.remove("flex-container-row");
        additionalDiv1.classList.remove("additional-scroll");
        additionalDiv1.classList.add("acc-page");

        if(user_type==="reader"){
            showUserAcc(user_id);
        }
        else if(user_type==="emp"){
            showEmpAcc(user_id);
        }
        else{
            showAdmAcc();
        }

        let wylogujButton = document.createElement("button");
        wylogujButton.innerText="Wyloguj";
        wylogujButton.classList.add("wyloguj");
        additionalDiv1.appendChild(wylogujButton);

        wylogujButton.addEventListener("click", function(){
            user_id=null;
            user_type=null;
            location.reload();
        });

    }

    function showUserAcc(user_id){

        let additionalDiv1 = document.querySelector(".additional-div1");
        let leftSideAcc = document.createElement("div");
        leftSideAcc.classList.add("left-side");
        let helloTekst = document.createElement("h2");
        helloTekst.classList.add("hello-tekst");
        helloTekst.textContent = "Witaj w koncie klienta!"
        let underHelloText = document.createElement("div");
        underHelloText.classList.add("dataDiv");
        underHelloText.classList.add("scroll");

        leftSideAcc.appendChild(helloTekst);
        leftSideAcc.appendChild(underHelloText);
        additionalDiv1.appendChild(leftSideAcc);

        let optionsDiv = document.createElement("div");
        optionsDiv.classList.add("options-container");

        let mojeDaneDiv = document.createElement("div");
        mojeDaneDiv.classList.add("option");
        mojeDaneDiv.textContent = "Moje Dane";

        let zamowieniaDiv = document.createElement("div");
        zamowieniaDiv.classList.add("option");
        zamowieniaDiv.textContent = "Zamówienia";

        let wypozyczeniaDiv = document.createElement("div");
        wypozyczeniaDiv.classList.add("option");
        wypozyczeniaDiv.textContent = "Wypożyczenia";

        let usunDiv = document.createElement("div");
       usunDiv.classList.add("option");
        usunDiv.textContent = "Usuń konto";

        optionsDiv.appendChild(mojeDaneDiv);
        optionsDiv.appendChild(zamowieniaDiv);
        optionsDiv.appendChild(wypozyczeniaDiv);
        optionsDiv.appendChild(usunDiv);
        additionalDiv1.appendChild(optionsDiv);

        fetchReaderData();

        zamowieniaDiv.addEventListener("click", function () {
            console.log("Zamówienia option clicked");
            fetchOrderData(user_id);                  //////////zamiana na readerID
        });

        wypozyczeniaDiv.addEventListener("click", function () {
            console.log("Wypożyczenia option clicked");
            fetchLoanData(user_id);                  //////////zamiana na readerID
        });

        mojeDaneDiv.addEventListener("click", function () {
            fetchReaderData();
        });

        usunDiv.addEventListener("click", function () {
            let modalContainer = document.createElement('div');
            modalContainer.classList.add("overlay");
            let modalContent = document.createElement('div');
            modalContent.classList.add("overlay-content");
            let modalText = document.createElement('p');
            modalText.innerText =`Czy na pewno chcesz usunąć swoje konto?`;
            let modalNoButton = document.createElement('button');
            modalNoButton.innerText = 'Nie';
            let modalYesButton = document.createElement('button');
            modalYesButton.innerText = 'Tak';

            modalContent.appendChild(modalText);
            modalContent.appendChild(modalNoButton);
            modalContent.appendChild(modalYesButton);
            modalContainer.appendChild(modalContent);
            document.body.appendChild(modalContainer);


            modalNoButton.addEventListener('click', function() {
                document.body.removeChild(modalContainer);
            });
            modalYesButton.addEventListener('click', function() {
                usunKonto();
                user_id=null;
                user_type=null;
                location.reload();
            });
        });
    }

    function usunKonto(){
        fetch(`/api/reader/byid?readerID=${user_id}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    accountID = data[0].accountID;
                    console.log("Account ID:", accountID);
                    deleteReaderAndAccount([user_id, accountID]);
                } else {
                    console.log("Tablica danych jest pusta.");
                }
            })
            .catch(error => {
                console.error('Error fetching reader data:', error);
            });
    }


    function showEmpAcc(user_id){

        let additionalDiv1 = document.querySelector(".additional-div1");
        let leftSideAcc = document.createElement("div");
        leftSideAcc.classList.add("left-side");

        let helloTekst = document.createElement("h2");
        helloTekst.textContent = "Witaj w koncie Pracownika!"

        let underHelloText = document.createElement("div");
        underHelloText.classList.add("dataDiv");
        underHelloText.classList.add("scroll");

        leftSideAcc.appendChild(helloTekst);
        leftSideAcc.appendChild(underHelloText);
        additionalDiv1.appendChild(leftSideAcc);

        let optionsDiv = document.createElement("div");
        optionsDiv.classList.add("options-container");

        let mojeDaneDiv = document.createElement("div");
        mojeDaneDiv.classList.add("option");
        mojeDaneDiv.textContent = "Dane osobowe";

        let zamowieniaDiv = document.createElement("div");
        zamowieniaDiv.classList.add("option");
        zamowieniaDiv.textContent = "Zamówienia";

        let egzemplarzeDiv = document.createElement("div");
        egzemplarzeDiv.classList.add("option");
        egzemplarzeDiv.textContent = "Zakup egzemplarzy";

        let wypozyczeniaDiv = document.createElement("div");
        wypozyczeniaDiv.classList.add("option");
        wypozyczeniaDiv.textContent = "Wypożyczenia";

        let platnosciDiv = document.createElement("div");
        platnosciDiv.classList.add("option");
        platnosciDiv.textContent = "Płatnosci";

        optionsDiv.appendChild(mojeDaneDiv);
        optionsDiv.appendChild(zamowieniaDiv);
        optionsDiv.appendChild(egzemplarzeDiv);
        optionsDiv.appendChild(wypozyczeniaDiv);
        optionsDiv.appendChild(platnosciDiv);
        additionalDiv1.appendChild(optionsDiv);

        fetchEmployeeData(user_id);

        egzemplarzeDiv.addEventListener("click", function () {
            let additionalDiv1 = document.querySelector(".additional-div1");
            additionalDiv1.innerHTML = `
                <div class="registration-form">
                  <h2>Dodaj nowy egzemplarz:</h2>
                  <div class="sections">
                  
                  <div class="section">
                  <label for="title">Tytuł</label>
                  <input type="text" id="title" name="title" required>
                  <label for="publisher">Wydawnictwo</label>
                  <input type="text" id="publisher" name="publisher" required>
                  <label for="year">Rok wydania</label>
                  <input type="text" id="year" name="year" pattern="\\d{4}" placeholder="YYYY" required>
                  <label for="language">Język egzemplarza</label>
                  <input type="text" id="language" name="language" required>
                  </div>
                  
                  <div class="section">
                  <label for="author">Autor</label>
                  <input type="text" id="author" name="author" required>
                  <label for="isbn">ISBN</label>
                  <input type="text" id="isbn" name="isbn" required>
                   <label for="format">Format</label>
                   <select id="format" name="format" required>
                        <option value="BOOK">Papierowy</option>
                        <option value="EBOOK">Elektroniczny</option>
                   </select>
                   <label for="libraryID">Biblioteka</label>
                   <select id="libraryID" name="libraryID" required>
                        <option value="1">Filia Wierzba</option>
                        <option value="2">Filia Dąb</option>
                        <option value="3">Filia Sosna</option>
                        <option value="4">Filia Jesion</option>
                        <option value="5">Filia Topola</option>
                   </select>
                   </div>
                   
				  </div>
				  <label for="blurb">Opis</label>
				  <input type="text" id="blurb" name="blurb" >
                  <button type="submit" id="addButton">Dodaj</button>
                </div>
              `;
            const blurbInput = document.getElementById("blurb");
            blurbInput.style.width = '20%';
            initializeAddButtonOne();
        });

        zamowieniaDiv.addEventListener("click", function () {
            getEmployeeLibrary(user_id)
                .then(libraryID => {
                    fetchCopyByLibrary(libraryID)
                        .then(copies => {
                            fetchOrderDataForEmployee(copies);
                        })
                })
                .catch(error => {
                    console.error("Błąd podczas pobierania danych pracownika:", error);
                });
        });

        wypozyczeniaDiv.addEventListener("click", function () {
            getEmployeeLibrary(user_id)
                .then(libraryID => {
                    fetchCopyByLibrary(libraryID)
                        .then(copies => {
                            fetchLoanDataForEmployee(copies, handleLoanData);
                        })
                })
                .catch(error => {
                    console.error("Błąd podczas pobierania danych pracownika:", error);
                });
        });

        platnosciDiv.addEventListener("click", function () {
            getEmployeeLibrary(user_id)
                .then(libraryID => {
                    console.log("Library ID:", libraryID);
                    fetchCopyByLibrary(libraryID)
                        .then(copies => {
                            fetchLoanDataForEmployee(copies, handleDeptData);
                        })
                })
                .catch(error => {
                    console.error("Błąd podczas pobierania danych pracownika:", error);
                });
        })

        mojeDaneDiv.addEventListener("click", function () {
            fetchEmployeeData(user_id);
        });
    }

    function showAdmAcc(){

        let additionalDiv1 = document.querySelector(".additional-div1");
        let leftSideAcc = document.createElement("div");
        leftSideAcc.classList.add("left-side");

        let helloTekst = document.createElement("h2");
        helloTekst.textContent = "Witaj w koncie Administratora!"

        let underHelloText = document.createElement("div");
        underHelloText.classList.add("dataDiv");

        leftSideAcc.appendChild(helloTekst);
        leftSideAcc.appendChild(underHelloText);
        additionalDiv1.appendChild(leftSideAcc);

        let optionsDiv = document.createElement("div");
        optionsDiv.classList.add("options-container");

        let mojeDaneDiv = document.createElement("div");
        mojeDaneDiv.classList.add("option");
        mojeDaneDiv.textContent = "Dane osobowe";

        let dodaniePracDiv = document.createElement("div");
        dodaniePracDiv.classList.add("option");
        dodaniePracDiv.textContent = "Dodanie pracownika";

        let pracownicyDiv = document.createElement("div");
        pracownicyDiv.classList.add("option");
        pracownicyDiv.textContent = "Pracownicy";

        let czytelnicyDiv = document.createElement("div");
        czytelnicyDiv.classList.add("option");
        czytelnicyDiv.textContent = "Czytelnicy";

        let bibliotekiDiv = document.createElement("div");
        bibliotekiDiv.classList.add("option");
        bibliotekiDiv.textContent = "Biblioteki";

        let otwarciaDiv = document.createElement('div');
        otwarciaDiv.classList.add("option");
        otwarciaDiv.textContent = "Dodaj otwarcie";

        let dailyOverdueCostDiv = document.createElement("div");
        dailyOverdueCostDiv.classList.add("option");
        dailyOverdueCostDiv.textContent = "Kary";

        optionsDiv.appendChild(mojeDaneDiv);
        optionsDiv.appendChild(dodaniePracDiv);
        optionsDiv.appendChild(pracownicyDiv);
        optionsDiv.appendChild(czytelnicyDiv);
        optionsDiv.appendChild(bibliotekiDiv);
        optionsDiv.appendChild(otwarciaDiv);
        optionsDiv.appendChild(dailyOverdueCostDiv);
        additionalDiv1.appendChild(optionsDiv);

        getAdminData();

        dailyOverdueCostDiv.addEventListener("click", function () {
            setDailyOverdueCost();
        })

        mojeDaneDiv.addEventListener("click", function () {
            getAdminData();
        });

        otwarciaDiv.addEventListener("click", function () {
            addOpeningForm();
        })

        dodaniePracDiv.addEventListener("click", function () {
            let underHelloText = document.querySelector(".dataDiv");
            underHelloText.classList.add("scroll");
            underHelloText.innerHTML = `
                <div class="registration-form">
                  <h2>Dodaj nowego pracownika:</h2>
                  <div class="sections">
                    <div class="section">
                    <label for="emp-name">Imię</label>
                    <input type="text" id="emp-name" name="emp-name" required>
                    <label for="emp-lastName">Nazwisko</label>
                    <input type="text" id="emp-lastName" name="emp-lastName" required>
                    <label for="emp-libraryID">Biblioteka:</label>
                    <select id="emp-libraryID" name="emp-libraryID">
                        <option value="1">Filia Wierzba</option>
                        <option value="2">Filia Dąb</option>
                        <option value="3">Filia Sosna</option>
                        <option value="4">Filia Jesion</option>
                        <option value="5">Filia Topola</option>
                    </select></div>
                    
                  <div class="section">
                    <label for="emp-address">Adres</label>
                     <input type="text" id="emp-address" name="emp-address" required>
                     <label for="emp-phoneNum">Numer telefonu</label>
                    <input type="text" id="emp-phoneNum" name="emp-phoneNum" required>
                  </div>
                   </div>
                  <button type="submit" id="addButton">Dodaj</button>
                </div>
              `;
            initializeAddButton(addEmpButtonClick);
        });

        pracownicyDiv.addEventListener("click", function () {
            fetchAllEmployeesData();
        });

        czytelnicyDiv.addEventListener("click", function () {
            fetchAllReadersData();
        })

        bibliotekiDiv.addEventListener("click", function () {
            fetchLibrariesData();
        })
    }

    function setDailyOverdueCost() {
        let dataDiv = document.querySelector(".dataDiv");
        dataDiv.innerHTML = '';

        let containerDiv = document.createElement('div');
        containerDiv.classList.add('daily-punishment-container');


        let divElement = document.createElement('div');
        divElement.innerHTML = `
        <p>Wysokość kary za przetrzymanie na 1 dzień</p>
        <p id="dailyPunishment"> Kara: ${daily_cost}</p>
    `;
        containerDiv.appendChild(divElement);
        dataDiv.appendChild(containerDiv);

        let dailyPunishmentElement = document.getElementById('dailyPunishment');
        dailyPunishmentElement.addEventListener('click', function () {
            let modalContainer = document.createElement('div');
            modalContainer.classList.add("overlay");
            let modalContent = document.createElement('div');
            modalContent.classList.add("overlay-content");
            let modalText = document.createElement('p');
            modalText.innerText =`Zmień wysokość kary za przetrzymanie`;

            let modalInput = document.createElement('input');
            modalInput.type = 'text';
            modalInput.placeholder = 'Wprowadź nową wartość';

            let modalNoButton = document.createElement('button');
            modalNoButton.innerText = 'Nie';
            let modalYesButton = document.createElement('button');
            modalYesButton.innerText = 'Tak';

            modalContent.appendChild(modalText);
            modalContent.appendChild(modalInput);
            modalContent.appendChild(modalNoButton);
            modalContent.appendChild(modalYesButton);
            modalContainer.appendChild(modalContent);
            document.body.appendChild(modalContainer);

            modalNoButton.addEventListener('click', function() {
                document.body.removeChild(modalContainer);
            });
            modalYesButton.addEventListener('click', function() {
                daily_cost = modalInput.value;
                document.body.removeChild(modalContainer);
            });
        });
    }

    function fetchOpeningData(openingID) {
        return fetch(`/api/opening/byid?openingID=${openingID}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Błąd pobierania danych otwarcia');
                }
                return response.json();
            })
            .catch(error => {
                console.error(error);
            });
    }

    function fetchLibraryOpeningData(libraryID) {
        return fetch(`/api/libopening/bylo?libraryID=${libraryID}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(libraryOpenings => {
                const fetchOpeningPromises = libraryOpenings.map(libraryOpening => {
                    return fetchOpeningData(libraryOpening.id.openingID);
                });

                return Promise.all(fetchOpeningPromises);
            })
            .catch(error => {
                console.error('Fetch error:', error);
                throw error;
            });
    }

    function fetchLibrariesData() {
        fetch(`/api/library/all`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Błąd HTTP. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                handleLibraryData(data);
            })
            .catch(error => {
                console.error('Błąd podczas zmiany adresu email:', error);
                throw error;
            });
    }

    function handleLibraryData(data) {
        let dataDiv = document.querySelector(".dataDiv");
        dataDiv.innerHTML = '';

        let olElement = document.createElement('ol');

        data.forEach((library) => {
            let liElement = document.createElement('li');
            liElement.textContent += `${library.name}: `;
            liElement.textContent += `${library.location}, `;
            liElement.textContent += `Numer telefonu: ${library.phoneNum}, `;
            liElement.textContent += `Email: ${library.email}`;

            liElement.addEventListener('click', function () {
                fetchLibraryOpeningData(library.id)
                    .then(openingsData => {
                        let openingsList = openingsData.map(openingArray => {
                            if (openingArray && openingArray.length > 0) {
                                let opening = openingArray[0];
                                if (opening.day && opening.openHour && opening.closeHour) {
                                    return `<li>${opening.day}: ${opening.openHour} - ${opening.closeHour}</li>`;
                                } else {
                                    console.log("Nieprawidłowe dane otwarcia:", opening);
                                    return "<li>Nieprawidłowe dane otwarcia</li>";
                                }
                            } else {
                                console.log("Nieprawidłowe dane otwarcia: brak danych");
                                return "<li>Nieprawidłowe dane otwarcia</li>";
                            }
                        }).join('');

                        let modalContainer = document.createElement('div');
                        modalContainer.classList.add("overlay");
                        let modalContent = document.createElement('div');
                        modalContent.classList.add("overlay-content");

                        // Create an unordered list and append each opening time as a list item
                         let modalList = document.createElement('ul');
                        modalList.innerHTML = openingsList;

                        // modalList.querySelectorAll("li").forEach((opening, index) => {
                        //     selectedOpening = openingsData[index];
                        //     addEventListener('click', function () {
                        //         let secondModalContainer = document.createElement('div');
                        //         secondModalContainer.classList.add("overlay");
                        //         let secondModalContent = document.createElement('div');
                        //         secondModalContent.classList.add("overlay-content-column");
                        //         let secondModalTitle = document.createElement('h2');
                        //         secondModalTitle.innerText = `Edytuj godziny otwarcia:`;
                        //         secondModalContent.appendChild(secondModalTitle);
                        //
                        //         let inputyDiv = document.createElement("div");
                        //         let modalInputOpen = document.createElement('input');
                        //         let modalInputClose = document.createElement('input');
                        //         modalInputOpen.type = 'text';
                        //         modalInputClose.type = 'text';
                        //         modalInputOpen.placeholder = 'HH:MM';
                        //         modalInputClose.placeholder = 'HH:MM';
                        //
                        //         secondModalContent.appendChild(inputyDiv);
                        //         inputyDiv.appendChild(modalInputOpen);
                        //         inputyDiv.appendChild(modalInputClose);
                        //         inputyDiv.classList.add("inputyDiv");
                        //
                        //         let buttonsDiv = document.createElement("div");
                        //         let modalSaveButton = createMButton('Zapisz');
                        //         let modalCancelButton = createMButton('Anuluj');
                        //         let modalDeleteButton = createMButton('Usuń');
                        //         secondModalContent.appendChild(buttonsDiv);
                        //         buttonsDiv.appendChild(modalSaveButton);
                        //         buttonsDiv.appendChild(modalCancelButton);
                        //         buttonsDiv.appendChild(modalDeleteButton);
                        //         buttonsDiv.classList.add("inputyDiv");
                        //
                        //         secondModalContainer.appendChild(secondModalContent);
                        //         document.body.appendChild(secondModalContainer);
                        //
                        //         if (selectedOpening.length > 0) {
                        //             const firstOpening = selectedOpening[0];
                        //
                        //             const theId = firstOpening.id;
                        //             const theDay = firstOpening.day;
                        //
                        //         modalSaveButton.addEventListener('click', function () {
                        //             modalInputOpen = modalInputOpen.trim();
                        //             modalInputClose = modalInputOpen.trim();
                        //             addLibraryOpening(library.id, theId, theDay, modalInputOpen, modalInputClose);
                        //             secondModalContainer.remove();
                        //         });
                        //
                        //         modalCancelButton.addEventListener('click', function () {
                        //             console.log('Kliknięto Anuluj');
                        //             secondModalContainer.remove();
                        //         });
                        //
                        //         modalDeleteButton.addEventListener('click', function () {
                        //             console.log("SELECTED", selectedOpening);
                        //             deleteLibraryOpening(library.id, theId)
                        //                 .then(bool => { if(!bool) alert("Otwarcie nie zostało usunięte"); })
                        //             secondModalContainer.remove();
                        //         });
                        //         } else {
                        //             console.error('selectedOpenings is empty.');
                        //         }
                        //     });
                        // });

                        modalContent.appendChild(modalList);
                        modalContainer.appendChild(modalContent);
                        document.body.appendChild(modalContainer);

                        modalContainer.addEventListener("click", function (event) {
                            if (!modalContent.contains(event.target)) {
                                modalContainer.remove();
                            }
                        });

                    })
                    .catch(error => {
                        console.error("Błąd podczas pobierania godzin otwarcia biblioteki", error);
                    });
            });
            olElement.appendChild(liElement);
        });
        dataDiv.appendChild(olElement);
    }


    function deleteLibraryOpening(libraryID, day) {
        return fetch(`/api/libopening/delete?libraryID=${libraryID}&day=${day}`)
            .then(response => response.json())
            .catch(error => console.error('Błąd podczas usuwania połączenia:', error));
    }



    function getLibrariesData() {
        return fetch(`/api/library/all`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Błąd HTTP. Status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Błąd podczas pobierania bibliotek:', error);
                throw error;
            });
    }

    function addLibraryOpening(libraryID, day, openHour, closeHour) {
        const libID = libraryID.value;
        const openDay = day.value;
        const openinghour = openHour.value;
        const closingHour = closeHour.value;
        deleteLibraryOpening(libID, openDay)
            .then(bool => {
                if(bool) {
                    fetch(`/api/libopening/add?libraryID=${libID}&day=${openDay}&openHour=${openinghour}&closeHour=${closingHour}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`Błąd HTTP. Status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .catch(error => {
                            console.error('Błąd podczas zmiany godzin otwarcia:', error);
                            throw error;
                        });
                }
            })
    }



    function createModalTimeInput(label, value) {
        let labelElement = document.createElement('label');
        labelElement.innerText = `${label}: `;
        let inputElement = document.createElement('input');
        inputElement.type = 'time';
        inputElement.value = value;
        inputElement.pattern = '^([01]?[0-9]|2[0-3]):[0-5][0-9]$';
        labelElement.appendChild(inputElement);
        return labelElement;
    }

    function createMButton(label) {
        let buttonElement = document.createElement('button');
        buttonElement.innerText = label;
        return buttonElement;
    }

    function getAdminData() {
        let accountID = 1000;
        fetch(`api/account/byid?accountID=${accountID}`)
            .then(response => response.json())
            .then(data => {
                let dataDiv = document.querySelector(".dataDiv");
                dataDiv.innerHTML = '';

                let containerDiv = document.createElement('div');
                containerDiv.classList.add('admin-container');

                let adminAccount = data[0];
                let email = adminAccount.email;

                let divElement = document.createElement('div');
                divElement.innerHTML = `
                    <p class="clickable">   Adres email: ${email}</p>
                    <p class="clickable">   Zmiana hasła</p>
                `;

                containerDiv.appendChild(divElement);
                dataDiv.appendChild(containerDiv);

                divElement.querySelectorAll('p.clickable').forEach((clickableParagraph) => {
                    divElement.style.marginLeft = '10px';
                    clickableParagraph.addEventListener('click', function () {
                        const clickedText = clickableParagraph.textContent.trim();
                        const propertyName = clickedText.split(':')[0].trim();
                        console.log('Kliknięto na: ', propertyName);

                        switch (propertyName) {
                            case 'Adres email':
                                openChangeModal("Zmiana adresu email", "Adres email", changeAdminEmail, accountID);
                                break;
                            case 'Zmiana hasła':
                                openChangePasswordModal(email);
                                break;
                            default:
                                console.warn('Brak obsługi dla klikniętego tekstu.');
                                break;
                        }
                    });

                    clickableParagraph.addEventListener('mouseover', function () {
                        clickableParagraph.style.textDecoration = 'underline';
                        clickableParagraph.style.cursor = 'pointer';
                    });

                    clickableParagraph.addEventListener('mouseout', function () {
                        clickableParagraph.style.textDecoration = 'none';
                        clickableParagraph.style.cursor = 'auto';
                    });
                });
            })
            .catch(error => console.error('Błąd pobierania danych:', error));
    }

    function changeAdminEmail(accountID, email) {
        fetch(`/api/account/update/email?accountID=${accountID}&email=${email}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Błąd HTTP. Status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Błąd podczas zmiany adresu email:', error);
                throw error;
            });
    }

    function changeAdminPassword(accountID, password) {
        fetch(`/api/account/update/password/byid?accountID=${accountID}&password=${password}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Błąd HTTP. Status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Błąd podczas zmiany hasła:', error);
                throw error;
            });
    }



    function getEmployeeLibrary(employeeID) {
        return fetch(`/api/employee/byid?employeeID=${employeeID}`)
            .then(response => response.json())
            .then(employees => {
                const nonEmptyEmployee = employees.find(empl => empl.libraryID !== null);
                if (nonEmptyEmployee) {
                    console.log('Pracownik:', nonEmptyEmployee);
                    return nonEmptyEmployee.libraryID;
                } else {
                    throw new Error('Niepoprawny identyfikator pracownika.');
                }
            })
            .catch(error => {
                console.error('Błąd podczas pobierania pracowników:', error);
                throw error;
            });
    }

    function initializePassButton() {
        let passButton = document.getElementById("passButton");
        passButton.addEventListener("click", function (event) {
            event.preventDefault();
            console.log("Button clicked");
            passButtonClick();
        });
    }
    function passButtonClick() {
        let email = document.getElementById("emailPass").value;
        let password = document.getElementById("forgotPassword").value;

        changePassword(email, password);
        let overlay = document.getElementsByClassName("overlay");
        overlay.remove();
    }

    function initializeAddButtonOne() {
        let addButton = document.getElementById("addButton");
        addButton.addEventListener("click", function (event) {
            event.preventDefault();
            console.log("Button clicked");
            addButtonClick();
        });
    }
    initializeAddButtonOne();


    function initializeAddButton(func) {
        let addButton = document.getElementById("addButton");
        addButton.addEventListener("click", function (event) {
            event.preventDefault();
            func();
        });
    }
    initializeAddButton();

    function addButtonClick() {
        let title = encodeURIComponent(document.getElementById("title").value);
        let author = encodeURIComponent(document.getElementById("author").value);
        let publisher = encodeURIComponent(document.getElementById("publisher").value);
        let isbn = encodeURIComponent(document.getElementById("isbn").value);
        let year = encodeURIComponent(document.getElementById("year").value);
        let format = encodeURIComponent(document.getElementById("format").value);
        let language = encodeURIComponent(document.getElementById("language").value);
        let blurb = encodeURIComponent(document.getElementById("blurb").value);
        let libraryID = encodeURIComponent(document.getElementById("libraryID").value);

        createCopy(title, author, publisher, isbn, year, format, language, blurb, libraryID);
    }

    function createCopy(title, author, publisher, isbn, year, format, language, blurb, libraryID) {
        let status = 'AVAILABLE';
        fetch(`/api/copy/add?title=${title}&author=${author}&publisher=${publisher}&ISBN=${isbn}&releaseYear=${year}&format=${format}&language=${language}&blurb=${blurb}&status=${status}&libraryID=${libraryID}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Błąd podczas tworzenia egzemplarza:', error);
            });
    }

    function initializeRegisterButton() {
        let registerButton = document.getElementById("registerButton");
        registerButton.addEventListener("click", function (event) {
            event.preventDefault();
            console.log("Button clicked");
            registerButtonClick();
        });
    }
    initializeRegisterButton();

    function registerButtonClick() {
        let firstName = document.getElementById("name").value;
        console.log("firstName:", firstName);
        let lastName = document.getElementById("lastName").value;
        console.log("lastName:", lastName);
        let phoneNum = document.getElementById("numerTelefonu").value;
        console.log("phone:", phoneNum);
        let email = document.getElementById("emailRegister").value;
        console.log("email:", email);
        let password = document.getElementById("passwordRegister").value;
        console.log("pass:", password);

        createAccount(email, password, firstName, lastName, phoneNum);
        let overlay = document.getElementsByClassName("overlay");
        overlay.remove();
    }

    function createAccount(email, password, firstName, lastName, phoneNumber) {
        fetch(`/api/account/add?email=${email}&password=${password}`)
            .then(response => response.json())
            .then(account => {
                createReader(firstName, lastName, phoneNumber, account.id);
            })
            .catch(error => {
                console.error('Błąd podczas tworzenia konta:', error);
            });
    }

    function createReader(firstName, lastName, phoneNumber, accountID) {
        fetch(`/api/reader/add?firstName=${firstName}&lastName=${lastName}&phoneNum=${phoneNumber}&account=${accountID}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Błąd podczas tworzenia czytelnika:', error);
            });
    }

    function searchKatalog() {
        let input = document.getElementById("Search");
        let filter = input.value.toLowerCase();
        let nodes = document.getElementsByClassName('target'); //gdziee szukamy

        for (i = 0; i < nodes.length; i++) {
            if (nodes[i].innerText.toLowerCase().includes(filter)) {
                nodes[i].style.display = "block";
            } else {
                nodes[i].style.display = "none";
            }
        }
    }

    function fetchBookData() {
        fetch('/api/book/all')
            .then(response => response.json())
            .then(data => {
                handleBookData(data);
            })
            .catch(error => {
                console.error('Error fetching book data:', error);
            });
    }


// Function to handle the book data and update the additionalDiv1
    function handleBookData(data) {
        let additionalDiv1 = document.querySelector(".additional-div1");

        // Add the "additional-div1" class to make it scrollable
        additionalDiv1.classList.add("additional-scroll");

        // Clear previous content
        additionalDiv1.innerHTML = '';

        // Create a container div to hold the book entries
        let containerDiv = document.createElement('div');
        containerDiv.classList.add('book-container');

        // Append the container div to additionalDiv1
        additionalDiv1.appendChild(containerDiv);

        // Define the number of books per page
        const booksPerPage = 14;
        // Calculate the total number of pages
        const totalPages = Math.ceil(data.length / booksPerPage);

        let currentPage = 1; // Initial page

        // Function to display books for the current page
        function displayBooks() {
            // Clear previous book entries
            containerDiv.innerHTML = '<input type="text" id="Search" onkeyup="searchKatalog()" placeholder="Wyszukaj...">';

            let searchDiv = document.getElementById("Search");
            searchDiv.addEventListener('input', function (){
                searchKatalog();
            });

            // Calculate start and end index for current page
            const startIndex = (currentPage - 1) * booksPerPage;
            const endIndex = Math.min(startIndex + booksPerPage, data.length);

            // Iterate through the data and create a div for each book
            for (let i = startIndex; i < endIndex; i++) {
                const book = data[i];
                // Create a div element for each book
                let divElement = document.createElement('div');
                divElement.classList.add("target");
                divElement.textContent = `${book.id}. ${book.title}, Autor: ${book.author}`; // Adjust property names accordingly
                divElement.id = `book-${book.id}`; // Set a unique ID based on the book's ID

                // Add event listener for each book div
                divElement.addEventListener('click', function() {
                    // Fetch data for the specific book ID
                    fetchCopyData(book);
                });

                // Append the div to the container
                containerDiv.appendChild(divElement);
            }

            // Append pagination to container
            createPagination();

        }

        // Create simplified pagination with only Previous and Next buttons
        function createPagination() {

            let paginationHTML = document.createElement('div');

            paginationHTML.innerHTML = `
                <div class="pagination">
                        <div id="prevPage">
                            &laquo;
                        </div>
                        <div id="nextPage">
                            &raquo;
                        </div>
                </div>
        `;
            containerDiv.appendChild(paginationHTML);

            // Attach event listeners after creating pagination
            attachEventListeners();
        }

        // Attach event listeners for pagination buttons
        function attachEventListeners() {
            // Event listener for previous page button
            document.getElementById('prevPage').addEventListener('click', () => {
                goToPage(currentPage - 1);
            });

            // Event listener for next page button
            document.getElementById('nextPage').addEventListener('click', () => {
                goToPage(currentPage + 1);
            });
        }

        // Initial display of books
        displayBooks();

        // Function to handle page navigation
        function goToPage(page) {
            if (page < 1 || page > totalPages) {
                return; // Do nothing if page is out of range
            }
            currentPage = page;
            displayBooks();
        }
    }




    // Function to fetch order data from the server
    function fetchOrderData(readerID) {
        fetch(`/api/orders/byid/reader?readerID=${readerID}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Success - Received data:', data);

                if (Array.isArray(data)) {
                    // Call a function to handle the retrieved data and update the additionalDiv1
                    handleOrderData(data);
                } else {
                    console.error('Error: Data is not an array');
                    // Handle the error condition appropriately, e.g., show a message to the user
                }
            })
            .catch(error => {
                console.error('Error fetching order data:', error);
                // If there's an error, you can still update the content or handle it accordingly
                handleOrderData([]);
            });
    }
    function fetchOrderDataForEmployee(copies) {
        console.log('Egzemplarze:', copies);
        const copyIDs = copies.map(copy => copy.id);
        let promises = [];

        copyIDs.forEach(id => {
            promises.push(
                fetch(`/api/orders/byid/copy?copyID=${id}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Błąd HTTP. Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data !== null) {
                            if (Array.isArray(data)) {
                                const filteredOrders = data.filter(order => copyIDs.includes(order.copyID));
                                if (filteredOrders.length > 0) {
                                    return filteredOrders;
                                }
                            } else {
                                console.error('Błąd: data nie jest tablicą');
                            }
                        }
                        return [];
                    })
                    .catch(error => {
                        console.error('Błąd podczas pobierania danych:', error);
                        return [];
                    })
            );
        });

        Promise.all(promises)
            .then(resultOrders => {
                const flatOrders = resultOrders.flat();
                handleOrderData(flatOrders);
            })
            .catch(error => {
                console.error('Błąd podczas przetwarzania zamówień:', error);
                handleOrderData([]);
            });
    }

    function fetchLoanDataForEmployee(copies, func) {
        console.log('Egzemplarze:', copies);
        const copyIDs = copies.map(copy => copy.id);
        let promises = [];

        copyIDs.forEach(id => {
            promises.push(
                fetch(`/api/loan/byid/copy?copyID=${id}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Błąd HTTP. Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data !== null) {
                            if (Array.isArray(data)) {
                                const filteredLoans = data.filter(loan => copyIDs.includes(loan.copyID));
                                if (filteredLoans.length > 0) {
                                    return filteredLoans;
                                }
                            } else {
                                console.error('Błąd: data nie jest tablicą');
                            }
                        }
                        return [];
                    })
                    .catch(error => {
                        console.error('Błąd podczas pobierania danych:', error);
                        return [];
                    })
            );
        });

        Promise.all(promises)
            .then(resultLoans => {
                const flatLoans = resultLoans.flat();
                func(flatLoans);
                console.log('Wypożyczenia:', flatLoans);
            })
            .catch(error => {
                console.error('Błąd podczas przetwarzania wypożyczeń:', error);
                func([]);
            });
    }

    function handleDeptData(data) {
        let dataDiv = document.querySelector(".dataDiv");
        dataDiv.innerHTML = '';

        let olElement = document.createElement('ol');

        getDailyOverdueCost()
            .then(dept => {
                let counter = 0;
                data.forEach((loan) => {
                    if (loan.status === 'OVERDUE') {
                        counter++;
                        let punishment = parseFloat(countDept(loan.returnDate, dept)).toFixed(1);
                        let liElement = document.createElement('li');
                        liElement.textContent = `Loan ID: ${loan.id}, Return date: ${loan.returnDate}, Status: ${loan.status}, Kara: ${punishment}`;

                        liElement.addEventListener('click', function () {
                            let modalContainer = document.createElement('div');
                            modalContainer.classList.add("overlay");
                            let modalContent = document.createElement('div');
                            modalContent.classList.add("overlay-content");
                            let modalText = document.createElement('p');
                            modalText.innerText =`Czy płatność ${punishment} dla wypożyczenia ${loan.id} została zrealizowana?`;
                            let modalNoButton = document.createElement('button');
                            modalNoButton.innerText = 'Nie';
                            let modalYesButton = document.createElement('button');
                            modalYesButton.innerText = 'Tak';

                            modalContent.appendChild(modalText);
                            modalContent.appendChild(modalNoButton);
                            modalContent.appendChild(modalYesButton);
                            modalContainer.appendChild(modalContent);
                            document.body.appendChild(modalContainer);

                            modalNoButton.addEventListener('click', function() {
                                document.body.removeChild(modalContainer);
                            });
                            modalYesButton.addEventListener('click', function() {
                                confirmPayment(loan.id);
                                document.body.removeChild(modalContainer);

                                setTimeout(function () {
                                    getEmployeeLibrary(user_id)
                                        .then(libraryID => {
                                            console.log("Library ID:", libraryID);
                                            fetchCopyByLibrary(libraryID)
                                                .then(copies => {
                                                    fetchLoanDataForEmployee(copies, handleDeptData);
                                                })
                                        })
                                        .catch(error => {
                                            console.error("Błąd podczas pobierania danych pracownika:", error);
                                        });
                                }, 1000); // Adjust the delay as needed
                            });

                        });
                        olElement.appendChild(liElement);
                    }
                })
                if(counter === 0) {
                    let liElement = document.createElement('p');
                    liElement.textContent = 'Aktualnie nikt nie posiada zadłużenia.';
                    dataDiv.appendChild(liElement);
                }
            });
        dataDiv.appendChild(olElement);
    }

    function confirmPayment(loanID) {
        let status = 'RETURNED';
        let params = [loanID, status];
        changeLoanStatus(params);
    }

    function countDept(returnDate, penaltyAmount) {
        let loanReturnDate = new Date(returnDate);
        let currentDate = new Date();
        let timeDifference = currentDate - loanReturnDate;
        let daysDifference = timeDifference / (1000 * 60 * 60 * 24);
        return daysDifference * penaltyAmount;
    }

    function getDailyOverdueCost() {
        return fetch(`/api/employee/dept`)
            .then(response => response.text())
            .then(text => {
                return parseFloat(text);
            })
            .catch(error => {
                console.error('Błąd podczas pobierania wartości:', error);
            });
    }

    function fetchCopyByLibrary(libraryID) {
        return fetch(`/api/copy/byid/library?libraryID=${libraryID}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(copies => {
                if (Array.isArray(copies) && copies.length > 0 && copies[0].id) {
                    return copies;
                } else {
                    throw new Error('Invalid or empty copy data.');
                }
            })
            .catch(error => {
                console.error('Error fetching copies from the specified library:', error);
            });
    }


    function handleOrderData(data) {
        let dataDiv = document.querySelector(".dataDiv");
        dataDiv.innerHTML = '';

        let olElement = document.createElement('ol');

        data.forEach((order) => {
            let liElement = document.createElement('li');
            liElement.textContent = `Order ID: ${order.id}, Date: ${order.date}, Status: ${order.status}`;

            liElement.addEventListener('click', function () {
                if(user_type === "reader") {
                    let modalContainer = document.createElement('div');
                    modalContainer.classList.add("overlay");
                    let modalContent = document.createElement('div');
                   modalContent.classList.add("overlay-content");
                    let modalText = document.createElement('p');
                    modalText.innerText =`Czy na pewno chcesz usunąć zamówienie ${order.id}?`;
                    let modalNoButton = document.createElement('button');
                    modalNoButton.innerText = 'Nie';
                    let modalYesButton = document.createElement('button');
                    modalYesButton.innerText = 'Tak';

                    modalContent.appendChild(modalText);
                    modalContent.appendChild(modalNoButton);
                    modalContent.appendChild(modalYesButton);
                    modalContainer.appendChild(modalContent);
                    document.body.appendChild(modalContainer);


                    modalNoButton.addEventListener('click', function() {
                        document.body.removeChild(modalContainer);
                        fetchOrderData(user_id);
                    });
                    modalYesButton.addEventListener('click', function() {
                        deleteOrder(order.id)
                            .then(() => {
                                document.body.removeChild(modalContainer);
                                fetchOrderData(user_id);
                            })
                            .catch(error => {
                                console.error('Error deleting order:', error);
                                // Handle the error condition appropriately
                            });
                    });

                } else if(user_type === "emp") {
                    let modalContainer = document.createElement('div');
                    modalContainer.classList.add("overlay");
                    let modalContent = document.createElement('div');
                    modalContent.classList.add("overlay-content");
                    let modalText = document.createElement('p');
                    modalText.innerText =`Wybierz opcję dla zamówienia ${order.id}:`;
                    let modalButton1 = document.createElement('button');
                    modalButton1.innerText = "Przygotuj";
                    let modalButton2 = document.createElement('button');
                    modalButton2.innerText = "Wypożycz";
                    let modalButton3 = document.createElement('button');
                    modalButton3.innerText = "Anuluj";

                    modalContent.appendChild(modalText);
                    modalContent.appendChild(modalButton1);
                    modalContent.appendChild(modalButton2);
                    modalContent.appendChild(modalButton3);
                    modalContainer.appendChild(modalContent);
                    document.body.appendChild(modalContainer);


                    modalButton1.addEventListener('click', function() {
                        prepareOrder(order.id);
                        document.body.removeChild(modalContainer);

                        // Introduce a delay before fetching updated data
                        setTimeout(function () {
                            getEmployeeLibrary(user_id)
                                .then(libraryID => {
                                    fetchCopyByLibrary(libraryID)
                                        .then(copies => {
                                            fetchOrderDataForEmployee(copies);
                                        })
                                })
                                .catch(error => {
                                    console.error("Błąd podczas pobierania danych pracownika:", error);
                                });
                        }, 1000); // Adjust the delay as needed
                    });

                    modalButton2.addEventListener('click', function() {
                        orderToLoan(order);
                        document.body.removeChild(modalContainer);

                        // Introduce a delay before fetching updated data
                        setTimeout(function () {
                            getEmployeeLibrary(user_id)
                                .then(libraryID => {
                                    fetchCopyByLibrary(libraryID)
                                        .then(copies => {
                                            fetchOrderDataForEmployee(copies);
                                        })
                                })
                                .catch(error => {
                                    console.error("Błąd podczas pobierania danych pracownika:", error);
                                });
                        }, 1000); // Adjust the delay as needed
                    });

                    modalButton3.addEventListener('click', function() {
                        document.body.removeChild(modalContainer);
                    });

                }
            });

            olElement.appendChild(liElement);
        });
        dataDiv.appendChild(olElement);
    }

    function prepareOrder(orderID) {
        let status = 'READY';
        fetch(`api/orders/update?orderID=${orderID}&status=${status}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Błąd podczas zmieniania statusu zamówienia:', error);
            });
    }

    function orderToLoan(order) {
        if(order.status === 'READY') {
            let readerID = order.readerID;
            let copyID = order.copyID;
            deleteOrder(order.id)
                .then(result => {
                    if (result) {
                        createLoan(user_id, copyID, readerID);
                        console.log('Zamówienie zostało usunięte.');
                    } else {
                        console.log('Usunięcie zamówienia nie powiodło się.');
                    }
                })
                .catch(error => {
                    console.error('Błąd:', error);
                });
        }
    }

    function createLoan(employeeID, copyID, readerID) {
        fetch(`/api/loan/add?employeeID=${employeeID}&copyID=${copyID}&readerID=${readerID}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Błąd podczas tworzenia wypożyczenia:', error);
            });
    }

    function deleteOrder(orderID) {
        return fetch(`/api/orders/delete?orderID=${orderID}`)
            .then(response => response.json())
            .then(result => {
                return result;
            })
            .catch(error => {
                console.error('Błąd podczas usuwania zamówienia:', error);
                throw error;
            });
    }

    function deleteLoan(loanID) {
        return fetch(`/api/loan/delete?loanID=${loanID}`)
            .then(response => response.json())
            .then(result => {
                return result;
            })
            .catch(error => {
                console.error('Błąd podczas usuwania wypożyczenia:', error);
                throw error;
            });
    }

    function cancelOrder(orderID) {
        fetch(`/api/orders/delete?orderID=${orderID}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Błąd podczas usuwania zamówienia:', error);
            });
    }

    function fetchLoanData(user_id) {
        fetch(`/api/loan/byid/reader?readerID=${user_id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Success - Received loan data:', data);

                if (Array.isArray(data)) {
                    handleLoanData(data);
                } else {
                    console.error('Error: Loan data is not an array');
                }
            })
            .catch(error => {
                console.error('Error fetching loan data:', error);
                handleLoanData([]);
            });
    }

    function handleLoanData(data) {
        // Assuming your data is an array of loan objects with properties like 'id', 'loanDate', 'returnDate', etc.
        // You may need to adjust this based on your actual data structure
        let dataDiv = document.querySelector(".dataDiv");
        dataDiv.innerHTML = '';

        // Create an ordered list element
        let olElement = document.createElement('ol');

        // Iterate through the data and append information to the ordered list
        data.forEach((loan) => {
            let liElement = document.createElement('li');
            liElement.textContent = `Loan ID: ${loan.id}, Loan Date: ${loan.loanDate}, Return Date: ${loan.returnDate}, Status: ${loan.status}`; // Adjust property names accordingly

            if(loan.status !== 'RETURNED') {
                liElement.addEventListener('click', function () {
                    if (user_type === "reader") {
                        if (loan.status === 'ACTIVE') {
                            let modalContainer = document.createElement('div');
                            modalContainer.classList.add("overlay");
                            let modalContent = document.createElement('div');
                            modalContent.classList.add("overlay-content");
                            let modalText = document.createElement('p');
                            modalText.innerText =`Czy chcesz przedłużyć ważność wypożyczenia ${loan.id}?`;
                            let modalNoButton = document.createElement('button');
                            modalNoButton.innerText = 'Nie';
                            let modalYesButton = document.createElement('button');
                            modalYesButton.innerText = 'Tak';

                            modalContent.appendChild(modalText);
                            modalContent.appendChild(modalNoButton);
                            modalContent.appendChild(modalYesButton);
                            modalContainer.appendChild(modalContent);
                            document.body.appendChild(modalContainer);


                            modalNoButton.addEventListener('click', function() {
                                document.body.removeChild(modalContainer);
                                fetchOrderData(user_id);
                            });
                            modalYesButton.addEventListener('click', function() {
                                prolongLoan(loan.id);
                                document.body.removeChild(modalContainer);
                                setTimeout(function () {
                                    fetchLoanData(user_id);
                                }, 1000); // Adjust the delay as needed
                            });
                        } else if (loan.status === 'OVERDUE') {
                            prompt('Wypożyczenie przetrzymane. Prolongata niemożliwa');
                        }
                    } else if (user_type === "emp") {
                        if (loan.status === 'ACTIVE') {
                            let modalContainer = document.createElement('div');
                            modalContainer.classList.add("overlay");
                            let modalContent = document.createElement('div');
                            modalContent.classList.add("overlay-content");
                            let modalText = document.createElement('p');
                            modalText.innerText =`Wybierz opcję dla wypożyczenia ${loan.id}:`;
                            let modalButton1 = document.createElement('button');
                            modalButton1.innerText = "Prolonguj";
                            let modalButton2 = document.createElement('button');
                            modalButton2.innerText = "Zakończ";
                            let modalButton3 = document.createElement('button');
                            modalButton3.innerText = "Anuluj";

                            modalContent.appendChild(modalText);
                            modalContent.appendChild(modalButton1);
                            modalContent.appendChild(modalButton2);
                            modalContent.appendChild(modalButton3);
                            modalContainer.appendChild(modalContent);
                            document.body.appendChild(modalContainer);

                            modalButton1.addEventListener('click', function() {
                                prolongLoan(loan.id);
                                document.body.removeChild(modalContainer);

                                // Introduce a delay before fetching updated data
                                setTimeout(function () {
                                    getEmployeeLibrary(user_id)
                                        .then(libraryID => {
                                            fetchCopyByLibrary(libraryID)
                                                .then(copies => {
                                                    fetchLoanDataForEmployee(copies, handleLoanData);
                                                })
                                        })
                                        .catch(error => {
                                            console.error("Błąd podczas pobierania danych pracownika:", error);
                                        });
                                }, 1000); // Adjust the delay as needed
                            });

                            modalButton2.addEventListener('click', function() {
                                changeLoanStatus([loan.id, 'RETURNED']);
                                document.body.removeChild(modalContainer);

                                // Introduce a delay before fetching updated data
                                setTimeout(function () {
                                    getEmployeeLibrary(user_id)
                                        .then(libraryID => {
                                            fetchCopyByLibrary(libraryID)
                                                .then(copies => {
                                                    fetchLoanDataForEmployee(copies, handleLoanData);
                                                })
                                        })
                                        .catch(error => {
                                            console.error("Błąd podczas pobierania danych pracownika:", error);
                                        });
                                }, 1000); // Adjust the delay as needed
                            });

                            modalButton3.addEventListener('click', function() {
                                document.body.removeChild(modalContainer);
                            });

                        } else if (loan.status === 'OVERDUE') {
                            let modalContainer = document.createElement('div');
                            modalContainer.classList.add("overlay");
                            let modalContent = document.createElement('div');
                            modalContent.classList.add("overlay-content");
                            let modalText = document.createElement('p');
                            modalText.innerText =`Czy chcesz zakończyć wypożyczenie ${loan.id}?`;
                            let modalNoButton = document.createElement('button');
                            modalNoButton.innerText = 'Nie';
                            let modalYesButton = document.createElement('button');
                            modalYesButton.innerText = 'Tak';

                            modalContent.appendChild(modalText);
                            modalContent.appendChild(modalNoButton);
                            modalContent.appendChild(modalYesButton);
                            modalContainer.appendChild(modalContent);
                            document.body.appendChild(modalContainer);


                            modalNoButton.addEventListener('click', function() {
                                document.body.removeChild(modalContainer);
                            });
                            modalYesButton.addEventListener('click', function() {
                                changeLoanStatus(loan.id, 'RETURNED');
                                document.body.removeChild(modalContainer);
                                setTimeout(function () {
                                    getEmployeeLibrary(user_id)
                                        .then(libraryID => {
                                            fetchCopyByLibrary(libraryID)
                                                .then(copies => {
                                                    fetchLoanDataForEmployee(copies, handleLoanData);
                                                })
                                        })
                                        .catch(error => {
                                            console.error("Błąd podczas pobierania danych pracownika:", error);
                                        });
                                }, 1000); // Adjust the delay as needed
                            });
                        }
                    }
                });
            }

            olElement.appendChild(liElement);
        });
        dataDiv.appendChild(olElement);
    }

    function prolongLoan(loanID) {
        fetch(`api/loan/update/date?loanID=${loanID}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Błąd podczas prolongowania wypożyczenia:', error);
            });
    }

    function changeLoanStatus(params) {
        const [loanID, status] = params;
        fetch(`api/loan/update/status?loanID=${loanID}&status=${status}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Błąd podczas zmieniania statusu wypożyczenia:', error);
            });
    }

    function fetchEmployeeData(user_id) {
        fetch(`/api/employee/byid?employeeID=${user_id}`)
            .then(response => response.json())
            .then(data => {
                handleEmployeeData(data);
            })
            .catch(error => {
                console.error('Błąd podczas pobierania danych pracownika:', error);
            });
    }

    function handleEmployeeData(data) {
        let dataDiv = document.querySelector(".dataDiv");
        dataDiv.innerHTML = '';

        let containerDiv = document.createElement('div');
        containerDiv.classList.add('employee-container');

        let employee = data[0];
        console.log('Employee:', employee);

        getLibraryName(employee.libraryID)
            .then(libraryArray => {
                if (libraryArray && libraryArray.length > 0) {
                    const library = libraryArray[0];
                    console.log('Library Object:', library);

                    let divElement = document.createElement('div');
                    divElement.innerHTML = `
                <p>                     Imię: ${employee.firstName}</p>
                <p class="clickable">   Nazwisko: ${employee.lastName}</p>
                <p class="clickable">   Adres: ${employee.address}</p>
                <p class="clickable">   Numer telefonu: ${employee.phoneNumber}</p>
                <p>                     Stanowisko: ${employee.position}</p>
                <p>                     Biblioteka: ${library.name}</p>
            `;

                    divElement.style.marginLeft = '10px';
                    containerDiv.appendChild(divElement);
                    dataDiv.appendChild(containerDiv);

                    divElement.querySelectorAll('p.clickable').forEach((clickableParagraph) => {
                        clickableParagraph.addEventListener('click', function () {
                            const clickedText = clickableParagraph.textContent.trim();
                            const propertyName = clickedText.split(':')[0].trim();
                            console.log('Kliknięto na: ', propertyName);

                            switch (propertyName) {
                                case 'Nazwisko':
                                    openChangeModal("Zmiana nazwiska", "Nazwisko", changeEmployeeLastName, user_id);
                                    break;
                                case 'Adres':
                                    openChangeModal("Zmiana adresu", "Adres", changeEmployeeAddress, user_id);
                                    break;
                                case 'Numer telefonu':
                                    openChangeModal("Zmiana numeru telefonu", "Numer telefonu", changeEmployeePhoneNumber, user_id);
                                    break;
                                default:
                                    console.warn('Brak obsługi dla klikniętego tekstu.');
                                    break;
                            }
                        });

                        clickableParagraph.addEventListener('mouseover', function () {
                            clickableParagraph.style.textDecoration = 'underline';
                            clickableParagraph.style.cursor = 'pointer';
                        });

                        clickableParagraph.addEventListener('mouseout', function () {
                            clickableParagraph.style.textDecoration = 'none';
                            clickableParagraph.style.cursor = 'auto';
                        });
                    });
                } else {
                    console.error('Błąd: Brak obiektu library w tablicy lub tablica jest pusta.');
                }
            });
    }

    function changeEmployeeLastName(employeeID, lastName) {
        fetch(`api/employee/update/lastName?employeeID=${employeeID}&lastName=${lastName}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Błąd HTTP. Status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Błąd podczas zmieniania nazwiska pracownika:', error);
                throw error;
            });
    }

    function changeEmployeeAddress(employeeID, address) {
        fetch(`api/employee/update/address?employeeID=${employeeID}&address=${address}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Błąd HTTP. Status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Błąd podczas zmieniania nazwiska pracownika:', error);
                throw error;
            });
    }

    function changeEmployeePhoneNumber(employeeID, phoneNumber) {
        fetch(`api/employee/update/phone?employeeID=${employeeID}&phoneNum=${phoneNumber}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Błąd HTTP. Status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Błąd podczas zmieniania nazwiska pracownika:', error);
                throw error;
            });
    }

    function getLibraryName(libraryID) {
        return fetch(`/api/library/byid?id=${libraryID}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Błąd HTTP. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(library => {
                return library;
            })
            .catch(error => {
                console.error('Błąd podczas pobierania nazwy biblioteki:', error);
                throw error;
            });
    }

    function fetchReaderData() {
        //////////zamiana na readerID
        fetch(`/api/reader/byid?readerID=${user_id}`)
            .then(response => response.json())
            .then(data => {
                handleReaderData(data);
            })
            .catch(error => {
                console.error('Error fetching reader data:', error);
            });
    }

    function handleReaderData(data) {
        let dataDiv = document.querySelector(".dataDiv");
        dataDiv.innerHTML = '';

        let containerDiv = document.createElement('div');
        containerDiv.classList.add('reader-container');

        let reader = data[0];

        let divElement = document.createElement('div');
        divElement.innerHTML = `
            <p>     Imię: ${reader.firstName}</p>
            <p class="clickable">     Nazwisko: ${reader.lastName}</p>
            <p class="clickable">     Adres: ${reader.address}</p>
            <p class="clickable">     Numer telefonu: ${reader.phoneNumber}</p>
            <p>     Numer karty: ${reader.libraryCardNumber}</p>
            <p class="clickable">     Zmień hasło:</p>
        `;
        containerDiv.appendChild(divElement);
        dataDiv.appendChild(containerDiv);

        divElement.querySelectorAll('p.clickable').forEach((clickableParagraph) => {
            clickableParagraph.addEventListener('click', function () {
                const clickedText = clickableParagraph.textContent.trim();
                const propertyName = clickedText.split(':')[0].trim();
                console.log('Kliknięto na: ', propertyName);
                switch (propertyName) {
                    case 'Nazwisko':
                        openChangeModal("Zmiana nazwiska", "Nazwisko", changeReaderLastName, user_id);
                        break;
                    case 'Adres':
                        openChangeModal("Zmiana adresu", "Adres", changeReaderAddress, user_id);
                        break;
                    case 'Numer telefonu':
                        openChangeModal("Zmiana numeru telefonu", "Numer telefonu", changeReaderPhoneNumber, user_id);
                        break;
                    case 'Zmień hasło':
                        openChangePasswordModal(reader.accountID, null);
                        break;
                    default:
                        console.warn('Brak obsługi dla klikniętego tekstu.');
                        break;
                }
            });
        });

    }


    function changeReaderLastName(readerID, lastName) {
        fetch(`/api/reader/update/lastname?readerID=${readerID}&lastName=${lastName}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Błąd HTTP. Status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Błąd podczas zmieniania nazwiska czytelnika:', error);
                throw error;
            });
    }


    function changeReaderAddress(readerID, address) {
        fetch(`api/reader/update/address?reader=${readerID}&address=${address}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Błąd HTTP. Status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Błąd podczas zmieniania adresu czytelnika:', error);
                throw error;
            });
    }

    function changeReaderPhoneNumber(readerID, phoneNumber) {
        fetch(`api/reader/update/phone?readerID=${readerID}&phoneNum=${phoneNumber}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Błąd HTTP. Status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Błąd podczas zmieniania numeru telefonu czytelnika:', error);
                throw error;
            });
    }

    function openChangePasswordModal(accountID, email) {
        let modalContainer = document.createElement('div');
        modalContainer.classList.add("overlay");

        let modalContent = document.createElement('div');
        modalContent.classList.add("overlay-content-column");

        let modalText = document.createElement('h2');
        modalText.innerText = "Zmień hasło:";

        let inputyDiv = document.createElement("div");
        inputyDiv.classList.add("inputyDiv");

        let inputText = document.createElement('input');
        inputText.type = 'password';
        inputText.placeholder = 'Nowe hasło';

        let repeatInputText = document.createElement('input');
        repeatInputText.type = 'password';
        repeatInputText.placeholder = 'Powtórz hasło';
        inputyDiv.appendChild(inputText);
        inputyDiv.appendChild(repeatInputText);

        let modalNoButton = document.createElement('button');
        modalNoButton.innerText = "Anuluj";
        modalNoButton.addEventListener('click', function () {
            document.body.removeChild(modalContainer);
        });

        let modalYesButton = document.createElement('button');
        modalYesButton.innerText = "Zmień";
        modalYesButton.addEventListener('click', function () {
            const newPassword1 = inputText.value;
            const newPassword2 = repeatInputText.value;

            if (newPassword1 === newPassword2) {
                if (accountID !== null && email !== null) {
                    changePassword(email, newPassword1)
                        .then(r => { if(!r) alert("Hasło niezmienione. Hasło musi posiadać 8 znaków [A-Z][a-z][0-9][@#$%^&+=!.]"); });
                }
                if (accountID === null) {
                    changePassword(email, newPassword1)
                        .then(r => { if(!r) alert("Hasło niezmienione. Hasło musi posiadać 8 znaków [A-Z][a-z][0-9][@#$%^&+=!.]"); });
                } else if (email === null) {
                    changePasswordByID(accountID, newPassword1)
                        .then(r => { if(!r) alert("Hasło niezmienione. Hasło musi posiadać 8 znaków [A-Z][a-z][0-9][@#$%^&+=!.]"); });
                }
                document.body.removeChild(modalContainer);
            } else {
                alert('Podane hasła nie są identyczne. Spróbuj ponownie.');
            }
        });

        let buttonyDiv = document.createElement("div");
        buttonyDiv.classList.add("inputyDiv");
        buttonyDiv.appendChild(modalNoButton);
        buttonyDiv.appendChild(modalYesButton);

        modalContent.appendChild(modalText);
        modalContent.appendChild(inputyDiv);
        modalContent.appendChild(buttonyDiv);
        modalContainer.appendChild(modalContent);
        document.body.appendChild(modalContainer);
    }

    function changePassword(email, password) {
        return fetch(`/api/account/update/password/byemail?email=${email}&password=${password}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Błąd podczas zmiany hasła:', error);
            });
    }

    function changePasswordByID(accountID, password) {
        return fetch(`/api/account/update/password/byid?accountID=${accountID}&password=${password}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Błąd podczas zmiany hasła:', error);
            });
    }

    function fetchCopyData(book) {
        fetch(`/api/copy/byid/book?bookID=${book.id}`)
            .then(response => response.json())
            .then(data => {
                // Call a function to handle the retrieved data and update the additionalDiv1
                handleCopyData(data,book);
            })
            .catch(error => {
                console.error('Error fetching copy data:', error);
            });
    }

    function handleCopyData(data, book) {
        // Create the modal overlay
        let modalOverlay = document.createElement('div');
        modalOverlay.classList.add('copy-overlay');

        // Create a container div to hold the copy entries
        let containerDiv = document.createElement('div');
        containerDiv.classList.add('copy-container');

        let tytulDiv = document.createElement('div');
        tytulDiv.classList.add('tytul-div-copy');

        tytulDiv.innerHTML=` ${book.title}, ${book.author}`;

        containerDiv.appendChild(tytulDiv);
        let  i= 1;
        // Iterate through the data and create a div for each copy
        data.forEach((copy) => {
            // Create a div element for each copy
            let divElement = document.createElement('div');
            divElement.classList.add(`${copy.id}`);
            // Add specific properties to the div
            divElement.textContent += `${i}.  ${copy.publisher}, `;
            divElement.textContent += `ISBN: ${copy.isbn}, `;
            divElement.textContent += `Rok wydania: ${copy.releaseYear}, `;
            divElement.textContent += `Format: ${copy.format}, `;
            divElement.textContent += `Język: ${copy.language}, `;
            divElement.textContent += `Status: ${copy.status}, `;
            divElement.textContent += `ID Filii: ${copy.libraryID}. `;
            // Append the div to the container
            containerDiv.appendChild(divElement);
            i+=1;

            divElement.addEventListener("click", function () {
                // Check if a copy element or its child is clicked

                // Check if the copy is available for ordering
                if (user_type === "reader") {
                    if (copy.status === 'AVAILABLE') {
                        // Show the order confirmation overlay
                        showOrderConfirmationOverlay(copy.id,data,book);
                    } else {
                        alert('Ten egzemplarz jest już wypożyczony! Wybierz inny.');
                    }
                } else {
                    // Show a message that the copy is unavailable for ordering
                    alert('W celu zamówienia ksiązki zaloguj się na konto klienta!');
                }
            });
        });

        // Append the container div to modalOverlay
        modalOverlay.appendChild(containerDiv);

        // Create a close button for the overlay
        let closeButton = document.createElement('button');
        closeButton.classList.add("close-button-copy");
        closeButton.textContent = 'Zamknij';
        closeButton.addEventListener('click', function () {
            // Remove the modal overlay when the close button is clicked
            document.body.removeChild(modalOverlay);
        });


        // Append the close button to the modal overlay
        containerDiv.appendChild(closeButton);

        // Append the modal overlay to the document body
        document.body.appendChild(modalOverlay);
    }

    // Function to show order confirmation overlay
    function showOrderConfirmationOverlay(copyID,data,book) {
        // Create the overlay div
        const overlayDiv = document.createElement("div");
        overlayDiv.classList.add("overlay");

        // Create the order confirmation div
        const orderConfirmationDiv = document.createElement("div");
        orderConfirmationDiv.classList.add("overlay-content-2");
        orderConfirmationDiv.innerHTML = `
            <p>Do you want to order this copy?</p>
            <button id="confirmOrder">Yes</button>
            <button id="cancelOrder">Cancel</button>
        `;

        // Append the order confirmation div to the overlay div
        overlayDiv.appendChild(orderConfirmationDiv);

        // Append the overlay div to the body
        document.body.appendChild(overlayDiv);

        // Add event listeners for confirmation and cancellation
        document.getElementById("confirmOrder").addEventListener("click", function () {
            // Call function to handle order confirmation and UI update
            confirmOrder(copyID)
                .then(() => {
                    overlayDiv.remove();
                        alert("Egzemplarz zamówiony!");
                        let divs = document.getElementsByClassName("copy-overlay");
                        if (divs.length > 0) {
                            divs[0].remove();
                        }
                })
                .catch(error => {
                    console.error("Error confirming order:", error);
                });
        });

        document.getElementById("cancelOrder").addEventListener("click", function () {
            // Close the overlay without confirming the order
            overlayDiv.remove();
        });
    }

    // Function to handle order confirmation
    function confirmOrder(copyID) {
        return new Promise((resolve, reject) => {
            fetch(`/api/orders/add?readerID=${user_id}&copyID=${copyID}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(data => {
                    console.log('Order created successfully:', data);
                    resolve(data); // Resolve the Promise with the data
                })
                .catch(error => {
                    console.error('Error creating order:', error);
                    reject(error); // Reject the Promise with the error
                });
        });
    }


    function createOrder(params) {
        const [readerID, copyID] = params;
        fetch(`/api/orders/add?readerID=${readerID}&copyID=${copyID}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Błąd podczas tworzenia zamówienia:', error);
            });
    }
    function openChangeModal(info, displayText,  func, param) {
        let modalContainer = document.createElement('div');
        modalContainer.classList.add("overlay")

        let modalContent = document.createElement('div');
        modalContent.classList.add("overlay-content");

        let modalText = document.createElement('p');
        modalText.innerText = info;

        let inputText = document.createElement('input');
        inputText.type = 'text';
        inputText.placeholder = displayText;

        let modalNoButton = document.createElement('button');
        modalNoButton.innerText = 'Nie';
        modalNoButton.addEventListener('click', function() {
            document.body.removeChild(modalContainer);
        });

        let modalYesButton = document.createElement('button');
        modalYesButton.innerText = 'Tak';
        modalYesButton.addEventListener('click', function() {
            const userInput = inputText.value;
            func(param, userInput);
            document.body.removeChild(modalContainer);
            setTimeout(function () {
                if(user_type==="emp") {
                    fetchEmployeeData(user_id);
                }else if(user_type==="reader"){
                   fetchReaderData();
                }
                else if(user_type==="adm"){
                    getAdminData();
                }
            }, 1000); // Adjust the delay as needed
        });

        modalContent.appendChild(modalText);
        modalContent.appendChild(inputText);
        modalContent.appendChild(modalNoButton);
        modalContent.appendChild(modalYesButton);
        modalContainer.appendChild(modalContent);
        document.body.appendChild(modalContainer);
    }

    function addEmpButtonClick() {
        let name = document.getElementById("emp-name").value.toLowerCase();
        let lastName = document.getElementById("emp-lastName").value.toLowerCase();
        let address = document.getElementById("emp-address").value.toLowerCase();
        let phoneNum = document.getElementById("emp-phoneNum").value.toLowerCase();
        let libraryID = document.getElementById("emp-libraryID").value.toLowerCase();

        let encodedName = encodeURIComponent(name);
        let encodedLastName = encodeURIComponent(lastName);
        let encodedAddress = encodeURIComponent(address);
        let encodedPhoneNum = encodeURIComponent(phoneNum);
        let encodedLibraryID = encodeURIComponent(libraryID);

        let email = removeDiacritics(name) + '.' + removeDiacritics(lastName) + '@employee.example.com';
        let password = 'EMPLOYEE' + removeDiacritics(name) + '.' + removeDiacritics(lastName) + '1!';

        createEmployeeAccount(email, password, encodedName, encodedLastName, encodedAddress, encodedPhoneNum, encodedLibraryID);
    }


    function removeDiacritics(inputString) {
        const diacriticsMap = {
            'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
            'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z'
        };

        return inputString.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, match => diacriticsMap[match] || match);
    }

    function createEmployeeAccount(email, password, firstName, lastName, address, phoneNumber, libraryID) {
        fetch(`/api/account/add?email=${email}&password=${password}`)
            .then(response => response.json())
            .then(account => {
                createEmployee(firstName, lastName, address, phoneNumber, libraryID, account.id);
            })
            .catch(error => {
                console.error('Błąd podczas tworzenia konta:', error);
            });
    }

    function createEmployee(firstName, lastName, address, phoneNumber, libraryID, accountID) {
        let position = "LIBRARIAN";
        fetch(`/api/employee/add?firstName=${firstName}&lastName=${lastName}&address=${address}&phoneNumber=${phoneNumber}&position=${position}&libraryID=${libraryID}&accountID=${accountID}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Błąd podczas tworzenia czytelnika:', error);
            });
    }

    function fetchAllReadersData() {
        fetch(`/api/reader/all`)
            .then(response => response.json())
            .then(data => {
                handleAllReadersData(data);
            })
            .catch(error => {
                console.error('Error fetching reader data:', error);
            });
    }

    function handleAllReadersData(data) {
        let dataDiv = document.querySelector(".dataDiv");
        dataDiv.innerHTML = '';
        dataDiv.classList.add("scroll");

        let olElement = document.createElement('ol');

        data.forEach((reader) => {
            let liElement = document.createElement('li');
            liElement.textContent += `${reader.firstName} `;
            liElement.textContent += `${reader.lastName}: `;
            liElement.textContent += `Adres: ${reader.address}, `;
            liElement.textContent += `Numer telefonu: ${reader.phoneNumber}, `;
            liElement.textContent += `Karta biblioteczna: ${reader.libraryCardNumber}`;

            liElement.addEventListener('mouseover', function () {
                liElement.style.textDecoration = 'underline';
            });
            liElement.addEventListener('mouseout', function () {
                liElement.style.textDecoration = 'none';
            });

            liElement.addEventListener('click', function () {
                let modalContainer = document.createElement('div');
                modalContainer.classList.add("overlay");
                let modalContent = document.createElement('div');
                modalContent.classList.add("overlay-content");
                let modalText = document.createElement('p');
                modalText.innerText =`Czy na pewno chcesz usunąć konto klienta ${reader.id}?`;
                let modalNoButton = document.createElement('button');
                modalNoButton.innerText = 'Nie';
                let modalYesButton = document.createElement('button');
                modalYesButton.innerText = 'Tak';

                modalContent.appendChild(modalText);
                modalContent.appendChild(modalNoButton);
                modalContent.appendChild(modalYesButton);
                modalContainer.appendChild(modalContent);
                document.body.appendChild(modalContainer);


                modalNoButton.addEventListener('click', function() {
                    document.body.removeChild(modalContainer);
                });
                modalYesButton.addEventListener('click', function() {
                    deleteReaderAndAccount([reader.id, reader.accountID]);
                    document.body.removeChild(modalContainer);
                    setTimeout(function () {
                        fetchAllReadersData();
                    }, 1000); // Adjust the delay as needed
                });
            });
            olElement.appendChild(liElement);
        });
        dataDiv.appendChild(olElement);
    }



    function deleteReaderAndAccount(params) {
        [readerID, accountID] = params;
        fetch(`/api/reader/delete?readerID=${readerID}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Błąd HTTP. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(readerDeleted => {
                if (readerDeleted) {
                    return fetch(`/api/account/delete?accountID=${accountID}`);
                } else {
                    throw new Error('Nie udało się usunąć czytelnika.');
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Błąd HTTP. Status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Błąd podczas usuwania czytelnika i konta:', error);
                throw error;
            });
    }

    function addOpeningForm() {
        let modalContainer = document.createElement('div');
        modalContainer.classList.add("overlay");
        let modalContent = document.createElement('div');
        modalContent.classList.add("overlay-content-column");
        let modalText = document.createElement('h2');
        modalText.innerText =`Zmień godziny otwarcia:`;

        let selecty = document.createElement("div");
        selecty.classList.add("inputyDiv");
        let librarySelect = document.createElement('select');
        let libraryName = ['Filia Czyżyny', 'Filia Śródmieście', 'Filia Bronowice', 'Filia Grzegórzki', 'Filia Krowodrza'];
        let libraryDATA = [1, 2, 3, 4, 5];
        for (let i = 0; i < 5; i++) {
            let option = document.createElement('option');
            option.value = libraryDATA[i];
            option.text = libraryName[i];
            librarySelect.appendChild(option);
        }

        // let libraries = [];
        // getLibrariesData()
        //     .then(data => {
        //         for (let i = 0; i < data.length; i++) {
        //             libraries.push(data[i]);
        //         }
        //         for(let i = 0; i < libraries.length; i++) {
        //             let option = document.createElement('option');
        //             option.value = libraries[i].id;
        //             option.text = libraries[i].name;
        //
        //             librarySelect.appendChild(option);
        //         }
        //         document.body.appendChild(librarySelect);
        //     })
        //     .catch(error => {
        //         console.error('Wystąpił błąd podczas pobierania danych:', error);
        //     });
        // document.body.appendChild(librarySelect);

        let daySelect = document.createElement('select');
        let daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
        for (let i = 0; i < daysOfWeek.length; i++) {
            let option = document.createElement('option');
            option.value = daysOfWeek[i];
            option.text = daysOfWeek[i];
            daySelect.appendChild(option);
        }
        selecty.appendChild(librarySelect);
        selecty.appendChild(daySelect);

        let inputyDiv = document.createElement("div");
        inputyDiv.classList.add("inputyDiv");
        let openHour = document.createElement('input');
        openHour.type = 'time';
        let closeHour = document.createElement('input');
        closeHour.type = 'time';
        inputyDiv.appendChild(openHour);
        inputyDiv.appendChild(closeHour);

        let buttonyDiv = document.createElement("div");
        buttonyDiv.classList.add("inputyDiv");
        let modalNoButton = document.createElement('button');
        modalNoButton.innerText = 'Anuluj';
        let modalYesButton = document.createElement('button');
        modalYesButton.innerText = 'Zapisz';
        buttonyDiv.appendChild(modalYesButton);
        buttonyDiv.appendChild(modalNoButton);

        modalContent.appendChild(modalText);
        modalContent.appendChild(selecty);
        modalContent.appendChild(inputyDiv);
        modalContent.appendChild(buttonyDiv);
        modalContainer.appendChild(modalContent);
        document.body.appendChild(modalContainer);

        modalNoButton.addEventListener('click', function() {
            document.body.removeChild(modalContainer);
        });
        modalYesButton.addEventListener('click', function() {
            addLibraryOpening(librarySelect, daySelect, openHour, closeHour);
        });
    }

    function fetchAllEmployeesData() {
        fetch(`/api/employee/all`)
            .then(response => response.json())
            .then(data => {
                handleAllEmployeesData(data);
            })
            .catch(error => {
                console.error('Error fetching reader data:', error);
            });
    }

    function handleAllEmployeesData(data) {
        let dataDiv = document.querySelector(".dataDiv");
        dataDiv.innerHTML = '';
        dataDiv.classList.add("scroll");

        let olElement = document.createElement('ol');

        data.forEach((employee) => {
            getLibraryName(employee.libraryID)
                .then(libraryArray => {
                    if (libraryArray && libraryArray.length > 0) {
                        const library = libraryArray[0];
                        let liElement = document.createElement('li');
                        liElement.textContent += `${employee.firstName} `;
                        liElement.textContent += `${employee.lastName}: `;
                        liElement.textContent += `Adres: ${employee.address}, `;
                        liElement.textContent += `Numer telefonu: ${employee.phoneNumber}, `;
                        liElement.textContent += `Stanowisko: ${employee.position}, `;
                        liElement.textContent += `${library.name}`;

                        liElement.addEventListener('mouseover', function () {
                            liElement.style.textDecoration = 'underline';
                        });
                        liElement.addEventListener('mouseout', function () {
                            liElement.style.textDecoration = 'none';
                        });

                        liElement.addEventListener('click', function () {
                            let modalContainer = document.createElement('div');
                            modalContainer.classList.add("overlay");
                            let modalContent = document.createElement('div');
                            modalContent.classList.add("overlay-content");
                            let modalText = document.createElement('p');
                            modalText.innerText =`Czy na pewno chcesz usunąć konto pracownika ${employee.id}?`;
                            let modalNoButton = document.createElement('button');
                            modalNoButton.innerText = 'Nie';
                            let modalYesButton = document.createElement('button');
                            modalYesButton.innerText = 'Tak';

                            modalContent.appendChild(modalText);
                            modalContent.appendChild(modalNoButton);
                            modalContent.appendChild(modalYesButton);
                            modalContainer.appendChild(modalContent);
                            document.body.appendChild(modalContainer);

                            modalNoButton.addEventListener('click', function() {
                                document.body.removeChild(modalContainer);
                            });
                            modalYesButton.addEventListener('click', function() {
                                deleteEmployeeAndAccount([employee.id, employee.accountID]);
                                document.body.removeChild(modalContainer);
                                setTimeout(function () {
                                    fetchAllEmployeesData();
                                }, 1000); // Adjust the delay as needed
                            });
                        });
                        olElement.appendChild(liElement);
                    }
                })
        });
        dataDiv.appendChild(olElement);
        dataDiv.style.maxHeight = '300px';
        dataDiv.style.overflow = 'auto';
    }

    function deleteEmployeeAndAccount(params) {
        [employee, accountID] = params;
        fetch(`/api/employee/delete?employeeID=${employee}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Błąd HTTP. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(employeeDeleted => {
                if (employeeDeleted) {
                    return fetch(`/api/account/delete?accountID=${accountID}`);
                } else {
                    throw new Error('Nie udało się usunąć pracownika.');
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Błąd HTTP. Status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Błąd podczas usuwania pracownika i konta:', error);
                throw error;
            });
    }

    function appendElementsToModal(modalContainer, ...elements) {
        elements.forEach(element => modalContainer.appendChild(element));
    }

});

// Save the current state in sessionStorage
function saveState() {
    let currentState = {
        user_id: user_id,
        user_type: user_type
    };
    sessionStorage.setItem('pageState', JSON.stringify(currentState));
}

// Load the saved state from sessionStorage
function loadState() {
    let savedState = sessionStorage.getItem('pageState');
    return savedState ? JSON.parse(savedState) : null;
}

function applyState(state) {
    if (state) {
        // Apply the saved user_id and user_type
        // Replace setUserId and setUserType with the actual functions to set user_id and user_type
       user_id=(state.user_id);
        user_type=(state.user_type);
        // Apply the saved content to additionalDiv1
    }

}

// Before reloading the page, save the current state
window.addEventListener('beforeunload', saveState);