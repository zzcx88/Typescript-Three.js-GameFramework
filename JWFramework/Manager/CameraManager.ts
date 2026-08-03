import * as THREE from 'three';
import type { Camera } from '../Object/Camera/Camera';
import { CameraMode } from '../enum';
import { SceneManager } from './SceneManager';
import { Water } from '../Object/InGameObject/Environment/Water';
import { WorldManager } from './WorldManager';


export class CameraManager
{

    private static instance: CameraManager;

    static getInstance()
    {
        if (!CameraManager.instance)
        {
            CameraManager.instance = new CameraManager;
        }
        return CameraManager.instance;
    }

    public get MainCamera(): Camera
    {
        return WorldManager.getInstance().MainCamera;
    }

    public get CameraMode(): CameraMode
    {
        return this.cameraMode;
    }

    public SetCameraSavedPosition(cameraMode: CameraMode)
    {
        switch (cameraMode)
        {
            case CameraMode.CAMERA_3RD:
                this.ChangeThirdPersonCamera();
                break;
            case CameraMode.CAMERA_ORBIT:
                this.ChangeOrbitCamera();
                break;

        }
    }

    private ChangeThirdPersonCamera()
    {
        const sceneManager = SceneManager.getInstance();
        const gameObjectForCamera = sceneManager.CurrentScene.Picker.GetPickParents();
        if ((gameObjectForCamera instanceof Water))
            return;

        
        this.cameraMode = CameraMode.CAMERA_3RD;
        sceneManager.CurrentScene.Picker.OrbitControl.enabled = false;

        gameObjectForCamera.GameObjectInstance.add(this.MainCamera.CameraInstance);
        const cameraPosition = gameObjectForCamera.PhysicsComponent.GetPosition();

        for (let i = 0; i < 2; ++i)
        {
            this.MainCamera.CameraInstance.lookAt(cameraPosition.x,
                cameraPosition.y + 1.5, cameraPosition.z);

            this.MainCamera.PhysicsComponent.SetPosition(0, 0, 0);

            const Up = new THREE.Vector3(0, 1, 0);
            const Look = new THREE.Vector3(0, 0, 1);

            this.MainCamera.PhysicsComponent.GetPosition().add(Up.multiplyScalar(0.6));
            this.MainCamera.PhysicsComponent.GetPosition().add(Look.multiplyScalar(-3.7));
        }
    }


    private ChangeOrbitCamera()
    {
        const sceneManager = SceneManager.getInstance();
        const picker = sceneManager.CurrentScene.Picker;

        this.cameraMode = CameraMode.CAMERA_ORBIT;
        picker.OrbitControl.enabled = true;
        const targetLocation: THREE.Vector3 = new THREE.Vector3;
        const gameObjectForCamera = sceneManager.CurrentScene.Picker.GetPickParents();
        gameObjectForCamera.GameObjectInstance.remove(this.MainCamera.CameraInstance);

        picker.OrbitControl.object.position.x = gameObjectForCamera.PhysicsComponent.GetPosition().x;
        picker.OrbitControl.object.position.y = gameObjectForCamera.PhysicsComponent.GetPosition().y + 15;
        picker.OrbitControl.object.position.z = gameObjectForCamera.PhysicsComponent.GetPosition().z;

        picker.OrbitControl.target = targetLocation.copy(gameObjectForCamera.PhysicsComponent.GetPosition());
        this.MainCamera.CameraInstance.lookAt(gameObjectForCamera.PhysicsComponent.GetPosition());
    }
    private cameraMode: CameraMode = CameraMode.CAMERA_ORBIT;
}
