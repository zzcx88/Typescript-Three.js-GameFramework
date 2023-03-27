namespace JWFramework
{
    export class UnitConvertManager
    {
        private static instance: UnitConvertManager;

        static getInstance()
        {
            if (!UnitConvertManager.instance)
            {
                UnitConvertManager.instance = new UnitConvertManager;
            }
            return UnitConvertManager.instance;
        }

        public ConvertToSpeedForKmh(distance: number): number
        {
            // 게임 세계에서 측정된 거리를 미터 단위로 변환
            let meterDistance = (distance * 5760) / ModelLoadManager.getInstance().planSize;

            // 시간을 초 단위로 계산
            let timeInSeconds = WorldManager.getInstance().GetDeltaTime();

            // 속도를 미터/초 단위로 계산
            let speedInMeterPerSecond = meterDistance / timeInSeconds;

            // 속도를 km/h 단위로 변환하여 반환
            speedInMeterPerSecond = speedInMeterPerSecond * 3.6
            return Math.round(speedInMeterPerSecond);
        }

        public ConvertToDistance(distance: number): number
        {
            let meterDistance = (distance * 5760) / ModelLoadManager.getInstance().planSize;
            return meterDistance;
        }
    }
}