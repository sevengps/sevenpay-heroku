import { PaymentsService } from "src/app/Services/payments.service";
import { Component, OnInit, SimpleChanges, OnChanges } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-hosted-payment",
  templateUrl: "./hosted-payment.component.html",
  styleUrls: ["./hosted-payment.component.scss"],
})
export class HostedPaymentComponent implements OnInit {
  constructor(
    private router: Router,
    private paymentsService: PaymentsService
  ) {}

  frenchElement: any;
  paymentHeader = "Selectionnez de votre mode de paiement";
  paymentHeaderResponsive = "Mode de paiement";
  selectedGateway = "";
  currentState = "Continuer";
  currentRoute = "";
  openStep1 = false;
  openStep2 = false;
  openStep3 = false;
  sucessPayment = false;
  waiting = false;
  formState;
  getUrl = this.router.url;
  stateId;

  ngOnInit() {
    this.frenchElement = document.querySelector(".language-container-french");
    // access api endpoint to get available payment providers
    this.paymentsService.getAuthHeader().subscribe(
      (auth) => {
        this.paymentsService.getAllAvailableProviders(auth.id);
        console.log(auth);
        this.stateId = auth.id;
      },
      (error) => {
        if (!error.success && this.stateId === undefined) {
          this.router.navigate(["/unauthorizedAccess"]);
        }
      }
    );
  }

  showPhone = false;
  showCard = false;

  getGateway(e) {
    this.selectedGateway = e;
    console.log(this.selectedGateway);
  }

  getActivatedComponentDetails(event) {
    console.log(event);

    if (event.openStep2 != undefined || event.waiting != undefined) {
      this.openStep2 = true;
      this.paymentHeader = "Details de paiement";
      this.paymentHeaderResponsive = "Details de paiement";
    }

    if (event.openStep3 != undefined) {
      this.openStep3 = true;
      this.openStep2 = false;
      this.paymentHeader = "Paiement Effectué";
      this.paymentHeaderResponsive = "Paiement Effectué";
    }

    if (event.openStep1 != undefined) {
      this.openStep1 = true;
      this.openStep2 = false;
      this.openStep3 = false;
      this.paymentHeader = "Selectionnez de votre mode de paiement";
    }

    if (event.currentRoute != undefined && event.currentRoute === "momopay") {
      this.currentRoute = event.currentRoute;
    } else {
      if (event.currentRoute != undefined && event.currentRoute === "visapay") {
        this.currentRoute = event.currentRoute;
      }
    }
  }

  showFrenchOption() {
    this.frenchElement.classList.add("showElement");
    setTimeout(() => {
      this.hideFrenchOption();
    }, 2500);
  }
  hideFrenchOption() {
    this.frenchElement.classList.remove("showElement");
  }
}
