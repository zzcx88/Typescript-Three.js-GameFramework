#include "Shaders.hlsl"
cbuffer cbGameObjectInfo : register(b2)
{
	matrix		gmtxWorld : packoffset(c0);
	uint		gnMaterialID : packoffset(c8);
	float		blendAmount : packoffset(c12);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
Texture2D gtxtTexture : register(t0);

//SamplerState gWrapSamplerState : register(s2);
//SamplerState gClampSamplerState : register(s3);

struct VS_TEXTURED_INPUT
{
	float3 position : POSITION;
	float2 uv : TEXCOORD;
};

struct VS_TEXTURED_OUTPUT
{
	float4 position : SV_POSITION;
	float2 uv : TEXCOORD;
};

VS_TEXTURED_OUTPUT VSTextured(VS_TEXTURED_INPUT input)
{
	VS_TEXTURED_OUTPUT output;

	output.position = mul(mul(mul(float4(input.position, 1.0f), gmtxWorld), gmtxView), gmtxProjection);
	output.uv = input.uv;

	return(output);
}

float4 PSTextured(VS_TEXTURED_OUTPUT input, uint primitiveID : SV_PrimitiveID) : SV_TARGET
{
	float4 cColor = gtxtTexture.Sample(gssWrap, input.uv);
	//AlphaToCoverageEnable 을 FALSE로 하였음으로 배경값을 직접 지워준다. 즉 알파값이 0.1 이하인 픽셀을 클리핑 한다.
	clip(cColor.a - 0.1f);
	return(cColor);
}