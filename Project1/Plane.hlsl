#include "Shaders.hlsl"
cbuffer cbGameObjectInfo : register(b2)
{
	matrix		gmtxWorld : packoffset(c0);
	uint		gnMaterialID : packoffset(c8);
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

	output.position = float4(input.position, 1.0f);
	output.uv = input.uv;

	return(output);
}

float4 PSTextured(VS_TEXTURED_OUTPUT input, uint primitiveID : SV_PrimitiveID) : SV_TARGET
{
	float4 cColor = gtxtTexture.Sample(gssWrap, input.uv);
	//float4 cColor = float4(0.0f,0.0f,0.0f,1.0f);
	//uint nWidth, nHeight, nMipLevels;
	//gtxtTexture.GetDimensions(0, nWidth, nHeight, nMipLevels);
	////int2 loc2 = int2(input.uv.x * nWidth, input.uv.y * nHeight);
	//int2 loc2 = input.position.xy;

	//if ((loc2.x <= 0) || (loc2.x >= nWidth - 1) || (loc2.y <= 0) || (loc2.x >= nHeight - 1))
	//	cColor = gtxtTexture[loc2];
	//else
	//{
	//	float4 crl = gtxtTexture[int2(loc2.x + 1, loc2.y)] - gtxtTexture[int2(loc2.x - 1, loc2.y)];
	//	float4 ctb = gtxtTexture[int2(loc2.x , loc2.y + 1)] - gtxtTexture[int2(loc2.x, loc2.y - 1)];
	//	cColor = (gtxtTexture[loc2] + crl + ctb)*0.2f;
	//}

	return(cColor);
}

//Texture2D gtxtTexture : register(t0);
//SamplerState gSamplerState : register(s0);
//
//struct VS_TEXTURED_INPUT
//{
//	float3 position : POSITION;
//	float2 uv : TEXCOORD;
//};
//
//struct VS_TEXTURED_OUTPUT
//{
//	float4 position : SV_POSITION;
//	float2 uv : TEXCOORD;
//};
//
//VS_TEXTURED_OUTPUT VSTextured(VS_TEXTURED_INPUT input)
//{
//	VS_TEXTURED_OUTPUT output;
//
//	output.position = mul(mul(mul(float4(input.position, 1.0f), gmtxGameObject), gmtxView), gmtxProjection);
//	output.uv = input.uv;
//
//	return(output);
//}
//
//float4 PSTextured(VS_TEXTURED_OUTPUT input) : SV_TARGET
//{
//	float4 cColor = gtxtTexture.Sample(gSamplerState, input.uv);
//
//	return(cColor);
//}