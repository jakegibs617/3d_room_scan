import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { RoomPlanScanner } from '../plugins/room-plan-scanner';
import type { RoomPlanScanResult } from '../types/room-plan-scan-result';
import './Home.css';

const RECENT_SCANS_STORAGE_KEY = 'bathforge:recent-scans';
const MAX_RECENT_SCANS = 5;

const isRecentScanResult = (scan: unknown): scan is RoomPlanScanResult => {
  if (!scan || typeof scan !== 'object') {
    return false;
  }

  const possibleScan = scan as Partial<RoomPlanScanResult>;

  return (
    typeof possibleScan.success === 'boolean' &&
    (typeof possibleScan.cancelled === 'undefined' || typeof possibleScan.cancelled === 'boolean') &&
    typeof possibleScan.message === 'string' &&
    typeof possibleScan.timestamp === 'string'
  );
};

const loadRecentScans = (): RoomPlanScanResult[] => {
  const storedScans = window.localStorage.getItem(RECENT_SCANS_STORAGE_KEY);

  if (!storedScans) {
    return [];
  }

  try {
    const parsedScans = JSON.parse(storedScans);

    if (Array.isArray(parsedScans)) {
      return parsedScans.filter(isRecentScanResult).slice(0, MAX_RECENT_SCANS);
    }
  } catch {
    window.localStorage.removeItem(RECENT_SCANS_STORAGE_KEY);
  }

  return [];
};

const Home: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<RoomPlanScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recentScans, setRecentScans] = useState<RoomPlanScanResult[]>(loadRecentScans);

  useEffect(() => {
    if (recentScans.length === 0) {
      window.localStorage.removeItem(RECENT_SCANS_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(RECENT_SCANS_STORAGE_KEY, JSON.stringify(recentScans));
  }, [recentScans]);

  const recordScanResult = (result: RoomPlanScanResult) => {
    setScanResult(result);
    setRecentScans((currentScans) => {
      const nextScans = [result, ...currentScans].slice(0, MAX_RECENT_SCANS);
      return nextScans;
    });
  };

  const startScan = async () => {
    setIsScanning(true);
    setErrorMessage(null);
    setScanResult(null);

    try {
      const result = await RoomPlanScanner.startScan();
      recordScanResult(result);

      if (!result.success) {
        setErrorMessage(result.message);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to start bathroom scan.';
      const result: RoomPlanScanResult = {
        success: false,
        cancelled: false,
        message,
        timestamp: new Date().toISOString(),
      };

      setErrorMessage(message);
      recordScanResult(result);
    } finally {
      setIsScanning(false);
    }
  };

  const clearRecentScans = () => {
    setRecentScans([]);
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

          {recentScans.length > 0 && (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Recent Scans</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList lines="full">
                  {recentScans.map((scan, index) => (
                    <IonItem key={index}>
                      <IonLabel>
                        <h2>{scan.success ? 'Completed scan' : scan.cancelled ? 'Cancelled scan' : 'Scan issue'}</h2>
                        <p>{new Date(scan.timestamp).toLocaleString()}</p>
                        <p>{scan.message}</p>
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonList>
                <IonButton
                  className="clear-history-button"
                  fill="clear"
                  color="medium"
                  onClick={clearRecentScans}
                >
                  Clear Recent Scans
                </IonButton>
              </IonCardContent>
            </IonCard>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
