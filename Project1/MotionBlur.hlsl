#include "Shaders.hlsl"

cbuffer cbGameObjectInfo : register(b2)
{
    matrix		gmtxWorld : packoffset(c0);

};

//float4x4 m_WVPNew; // 현재 월드 공간의 월드 ×보기 × 투영
//float4x4 m_WVPOld; // 과거의 월드 공간의 월드 ×보기 × 투영
//float4x4 m_ROnly; // 법선 벡터를 월드 공간에서 변환하는 행렬. 법선 벡터이므로 회전 성분 만.

Texture2D tex0            : register(t4); // 장면의 렌더링 이미지. Pass1에서 사용한다.

//sampler tex0 : register (s0);
sampler tex1 : register (s0); // 속도 맵. Pass1에서 사용한다.

// 속도 맵을 작성
struct VS_CreateVMap_INPUT
{
    float4 position : POSITION;
    float4 normal : NORMAL;
    float2 uv : TEXCOORD;
};

struct VS_CreateVMap_OUTPUT
{
    float4 position : SV_POSITION;
    float4 uv : TEXCOORD; // 속도 벡터
};

VS_CreateVMap_OUTPUT VS_CreateVMap(VS_CreateVMap_INPUT input)
{
    VS_CreateVMap_OUTPUT Out;

    // 법선 벡터는 회전 성분 만의 행렬을 적용 할
    float3 N = mul(input.normal.xyz, m_ROnly);

    // 현재의 정점의 좌표
    float4 NewPos = mul(input.position, m_WVPNew);

    // 과거의 정점의 좌표
    float4 OldPos = mul(input.position, m_WVPOld);

    // 정점의 이동 방향 벡터
    float3 Dir = NewPos.xyz - OldPos.xyz;

    // 정점의 이동 방향 벡터와 정점 법선의 내적을 계산
    float a = dot(normalize(Dir), normalize(N));

    // 과거의 방향으로 모델을 뻗어
    if (a < 0.0f)
        Out.position = OldPos;
    else
        Out.position = NewPos;

    // 속도 벡터의 계산
    //-1.0f에서 1.0f의 범위를 텍스처 좌표계의 0.0f ~ 1.0f의 텍셀 위치를 참조하기 위해 거리를 반으로
    Out.uv.xy = (NewPos.xy / NewPos.w - OldPos.xy / OldPos.w) * 0.5f;

    // 마지막으로 텍셀의 오프셋 값이되기 때문에 Y 방향을 반대 방향으로하는
    Out.uv.y* = -1.0f;

    // 장면의 Z 값을 계산하기위한 매개 변수
    Out.uv.z = Out.position.z;
    Out.uv.w = Out.position.w;

    return Out;
}

float4 PS_CreateVMap(VS_CreateVMap_OUTPUT In) : SV_TARGET
{
   float4 Out;

    // 속도 벡터
    Out.xy = In.uv.xy;

    // 미사용
    Out.z = 1.0f;

    // Z 값을 계산
    Out.w = In.uv.z / In.uv.w;

    return Out;
}

// 속도 맵을 참조 블러 처리
struct VS_Final_INPUT
{
    float4 position : POSITION;
    float4 color : COLOR;
    float2 uv : TEXCOORD;

};

struct VS_Final_OUTPUT
{
    float4 position : SV_POSITION;
    float2 uv : TEXCOORD;
};

VS_Final_OUTPUT VS_Final(VS_Final_INPUT input)
{
    VS_Final_OUTPUT Out;

    Out.position = input.position;
    Out.uv = input.uv;

    return Out;
}

float4 PS_Final(VS_Final_OUTPUT In) : SV_TARGET
{

    // 노망의 부드러움. 수치를 크게하면 매끄럽게된다.
    int Blur = 10;

    // 속도 맵에서 속도 벡터 및 Z 값을 얻을
    float4 Velocity = tex2D(tex1, In.uv);

    Velocity.xy / = (float)Blur;

    int cnt = 1;
    float4 BColor;

    // 장면의 렌더링 이미지를 얻을. a 성분에 Z 값이 저장된다.
    float4 Out = tex2D(tex0, In.uv);

    for (int i = cnt; i < Blur; i++)
    {
        // 속도 벡터의 방향 텍셀 위치를 참조 장면의 렌더링 이미지의 색상 정보를 얻을 수 있습니다.
        BColor = tex2D(tex0, In.uv + Velocity.xy * (float)i);

        // 속도 맵의 Z 값과 속도 벡터 방향에있는 텍셀 위치를 샘플링 한 장면의 렌더링 이미지의 Z 값을 비교한다. (주의 1)
        if (Velocity.a < BColor.a + 0.04f)
        {
           cnt++;
           Out + = BColor;
        }
    }

     Out / = (float)cnt;

     return Out;
}
//
//technique TShader
//{
//    // 속도 맵 작성
//    pass P0
//    {
//        VertexShader = compile vs_1_1 VS_CreateVMap();
//        PixelShader = compile ps_2_0 PS_CreateVMap();
//    }
//
//    // 블러 처리
//    pass P1
//    {
//        VertexShader = compile vs_1_1 VS_Final();
//        PixelShader = compile ps_3_0 PS_Final();
//    }
//}