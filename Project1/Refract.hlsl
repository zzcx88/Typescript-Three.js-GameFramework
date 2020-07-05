#include "Shaders.hlsl"

cbuffer cbGameObjectInfo : register(b2)
{
	matrix		gmtxWorld : packoffset(c0);
	uint		gnMaterialID : packoffset(c8);
	float		blendAmount : packoffset(c12);
};

Texture2D gtxtTexture : register(t0);


struct VS_TEXTURED_INPUT
{
	float3 position : POSITION;
	float2 uv : TEXCOORD;
};

struct VS_TEXTURED_OUTPUT
{
	float4 position : SV_POSITION;
	float2 uv : TEXCOORD;
	float4 refractionPosition : TEXCOORD1;
};

VS_TEXTURED_OUTPUT VSTextured(VS_TEXTURED_INPUT input)
{
	VS_TEXTURED_OUTPUT output;
	matrix viewProjectWorld;

	//input.position.w = 1.0f;

	//output.position = mul(mul(mul(float4(input.position, 1.0f), gmtxWorld), gmtxView), gmtxProjection);

	output.position = mul(float4(input.position, 1.0f), gmtxWorld);
	output.position = mul(output.position, gmtxView);
	output.position = mul(output.position, gmtxProjection);

	output.uv = input.uv;

	viewProjectWorld = mul(gmtxView, gmtxProjection);
	viewProjectWorld = mul(gmtxWorld, viewProjectWorld);

	output.refractionPosition = mul(float4(input.position, 1.0f), viewProjectWorld);

	return(output);
}

float4 PSTextured(VS_TEXTURED_OUTPUT input, uint primitiveID : SV_PrimitiveID) : SV_TARGET
{
	float2 refractTexCoord;
	float4 normalMap;
	float3 normal;
	float4 refractionColor;
	float4 textureColor;
	float4 color;

	refractTexCoord.x = input.refractionPosition.x / input.refractionPosition.w / 2.0f + 0.5f;
	refractTexCoord.y = -input.refractionPosition.y / input.refractionPosition.w / 2.0f + 0.5f;

	normalMap = gtxtNormalTexture.Sample(gssWrap, input.uv);

	normal = (normalMap.xyz * 2.0f) - 1.0f;

	refractTexCoord = refractTexCoord + (normal.xy * gfBlendAmount);

	refractionColor = gtxtTexture.Sample(gssWrap, refractTexCoord);

	//refractionColor.a = 0.3;
	//clip(refractionColor.a - 0.1);
	return refractionColor;
}