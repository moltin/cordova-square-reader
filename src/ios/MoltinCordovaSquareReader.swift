import SquareReaderSDK
import CoreLocation
import AVKit

@objc(MoltinCordovaSquareReader) class MoltinCordovaSquareReader : CDVPlugin, SQRDCheckoutControllerDelegate, SQRDReaderSettingsControllerDelegate, CLLocationManagerDelegate {
    
    private lazy var locationManager = CLLocationManager()
    private var currentCommand: CDVInvokedUrlCommand?
    private var locationPermissionCallback: ((Bool) -> ())?
    
    @objc(setup:)
    func setup(command: CDVInvokedUrlCommand) {
        
        self.locationManager.delegate = self
        
        func requestLocationPermission(callback: @escaping (Bool) -> ()) {
            switch CLLocationManager.authorizationStatus() {
            case .notDetermined:
                self.locationPermissionCallback = callback
                self.locationManager.requestWhenInUseAuthorization()
            case .restricted, .denied:
                print("Show UI directing the user to the iOS Settings app")
                callback(false)
            case .authorizedAlways, .authorizedWhenInUse:
                print("Location services have already been authorized.")
                callback(true)
            }
        }
        
        func requestMicrophonePermission(callback: @escaping (Bool) -> ()) {
            // Note: The microphone permission prompt will not be displayed
            // when running on the simulator
            AVAudioSession.sharedInstance().requestRecordPermission { authorized in
                callback(authorized)
            }
        }
        
        
        requestLocationPermission() { locationSuccess in
            self.locationPermissionCallback = nil
            
            if locationSuccess {
                requestMicrophonePermission() { microphoneSuccess in
                    if microphoneSuccess {
                        self.commandDelegate.send(CDVPluginResult(status: CDVCommandStatus_OK), callbackId: command.callbackId)
                        return
                    } else {
                        self.commandDelegate.send(CDVPluginResult(status: CDVCommandStatus_ERROR), callbackId: command.callbackId)
                    }
                }
            } else {
                self.commandDelegate.send(CDVPluginResult(status: CDVCommandStatus_ERROR), callbackId: command.callbackId)
            }
        }
        
    }
    
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        if status == .authorizedAlways || status == .authorizedWhenInUse {
            self.locationPermissionCallback?(true)
        } else if status == .restricted || status == .denied {
            self.locationPermissionCallback?(false)
        }
    }
    
    func retrieveAuthorizationCode(command: CDVInvokedUrlCommand) -> String {
        return "sq0acp-bFfIC3wV9xKx0cAc_8aoMbMmUtb_j2BNpL2WR55sS6Y"
    }
    
    @objc(authorizeReaderSDKIfNeeded:)
    func authorizeReaderSDKIfNeeded(command: CDVInvokedUrlCommand) {
        if SQRDReaderSDK.shared.isAuthorized {
            print("Already authorized.")
            self.commandDelegate.send(CDVPluginResult(status: CDVCommandStatus_OK), callbackId: command.callbackId)
        } else {
            guard let commandParams = command.arguments.first as? [String: Any],
                let authCode = commandParams["authCode"] as? String else {
                    self.commandDelegate.send(CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: "No parameters"), callbackId: command.callbackId)
                    return
            }
            SQRDReaderSDK.shared.authorize(withCode: authCode) { location, error in
                if let authError = error {
                    // Handle the error
                    print(authError)
                    self.commandDelegate.send(CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: authError.localizedDescription), callbackId: command.callbackId)
                }
                else {
                    // Proceed to the main application interface.
                    self.commandDelegate.send(CDVPluginResult(status: CDVCommandStatus_OK), callbackId: command.callbackId)
                }
            }
        }
    }
    
    @objc(startCheckout:)
    func startCheckout(command: CDVInvokedUrlCommand) {
        
        guard let commandParams = command.arguments.first as? [String: Any],
                let amount = commandParams["amount"] as? Int else {
            self.commandDelegate.send(CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: "No parameters"), callbackId: command.callbackId)
            return
        }
        
        // Create an amount of money in the currency of the authorized Square account
        let amountMoney = SQRDMoney(amount: amount)
        
        // Create parameters to customize the behavior of the checkout flow.
        let params = SQRDCheckoutParameters(amountMoney: amountMoney)
        params.additionalPaymentTypes = [.cash, .manualCardEntry]
        
        // Create a checkout controller and call present to start checkout flow.
        let checkoutController = SQRDCheckoutController(
            parameters: params,
            delegate: self)
        
        self.currentCommand = command
        
        checkoutController.present(from: self.viewController)
    }
    
    @objc(pairCardReaders:)
    func pairCardReaders(command: CDVInvokedUrlCommand) {
        let readerSettingsController = SQRDReaderSettingsController(
            delegate: self
        )
        readerSettingsController.present(from: self.viewController)
    }
    
    
    @objc(checkoutControllerDidCancel:)
    func checkoutControllerDidCancel(
        _ checkoutController: SQRDCheckoutController) {
        print("Checkout cancelled.")
        guard let currentCommand = self.currentCommand else {
            return
        }
        self.commandDelegate.send(CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: "Cancelled"), callbackId: currentCommand.callbackId)
        self.currentCommand = nil
    }
    
    @objc(checkoutController:didFailWithError:)
    func checkoutController(
        _ checkoutController: SQRDCheckoutController, didFailWith error: Error) {
        guard let currentCommand = self.currentCommand else {
            return
        }
        self.commandDelegate.send(CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: error.localizedDescription), callbackId: currentCommand.callbackId)
        self.currentCommand = nil
    }
    
    @objc(checkoutController:didFinishCheckoutWithResult:)
    func checkoutController(
        _ checkoutController: SQRDCheckoutController,
        didFinishCheckoutWith result: SQRDCheckoutResult) {
        guard let currentCommand = self.currentCommand else {
            return
        }
        self.commandDelegate.send(CDVPluginResult(status: CDVCommandStatus_OK), callbackId: currentCommand.callbackId)
        self.currentCommand = nil
    }
    
    @objc(readerSettingsControllerDidPresent:)
    func readerSettingsControllerDidPresent(
        _ readerSettingsController: SQRDReaderSettingsController) {
        print("Reader settings flow presented.")
    }
    
    @objc(readerSettingsController:didFailToPresentWithError:)
    func readerSettingsController(
        _ readerSettingsController: SQRDReaderSettingsController,
        didFailToPresentWith error: Error) {
        guard let currentCommand = self.currentCommand else {
            return
        }
        self.commandDelegate.send(CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: error.localizedDescription), callbackId: currentCommand.callbackId)
        self.currentCommand = nil
    }
}
