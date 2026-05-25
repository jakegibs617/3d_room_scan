import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useState } from 'react';
import { RoomPlanScanner } from '../plugins/room-plan-scanner';
import type { RoomPlanScanResult } from '../types/room-plan-scan-result';
import './Home.css';

const Home: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<RoomPlanScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startScan = async () => {
    setIsScanning(true);
    setErrorMessage(null);
    setScanResult(null);

    try {
      const result = await RoomPlanScanner.startScan();
      setScanResult(result);

      if (!result.success) {
        setErrorMessage(result.message);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to start bathroom scan.';
      setErrorMessage(message);
      setScanResult({
        success: false,
        cancelled: false,
        message,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>BathForge</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">BathForge</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="home">
          <IonButton expand="block" size="large" onClick={startScan} disabled={isScanning}>
            {isScanning ? (
              <>
                <IonSpinner name="crescent" />
                Scanning
              </>
            ) : (
              'Start Bathroom Scan'
            )}
          </IonButton>

          {errorMessage && (
            <IonCard color="danger">
              <IonCardHeader>
                <IonCardTitle>Scan unavailable</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>{errorMessage}</IonCardContent>
            </IonCard>
          )}

          {scanResult && (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  {scanResult.success ? 'Scan Result' : 'Scan Response'}
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonText>
                  <pre>{JSON.stringify(scanResult, null, 2)}</pre>
                </IonText>
              </IonCardContent>
            </IonCard>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
