//=============================================================================
// 최대 5픽셀까지의 흐리기 반지름으로 분리 가능 가우스 흐리기를 수행한다.
//=============================================================================

cbuffer cbSettings : register(b0)
{ 
	// 루트 상수들에 대응되는 상수 버퍼에 배열을 둘 수는 없으므로,
	// 다음처럼 배열 원소들을 개별 변수로서 나열해야 한다.
	int gBlurRadius;

	// 최대 11개의 흐리기 가중치를 지원한다.
	float w0;
	float w1;
	float w2;
	float w3;
	float w4;
	float w5;
	float w6;
	float w7;
	float w8;
	float w9;
	float w10;
	float w11;
	float w12;
	float w13;
	float w14;
	float w15;
	float w16;
	float w17;
	float w18;
	float w19;
	float w20;
};

static const int gMaxBlurRadius = 10;


Texture2D gInput            : register(t4);
RWTexture2D<float4> gOutput : register(u0);

#define N 256
#define CacheSize (N + 2*gMaxBlurRadius)
groupshared float4 gCache[CacheSize];

[numthreads(N, 1, 1)]
void HorzBlurCS(int3 groupThreadID : SV_GroupThreadID,
				int3 dispatchThreadID : SV_DispatchThreadID)
{
	// 가중치들을 배열에 넣는다(색인으로 접근할 수 있도록)
	float weights[21] = { w0, w1, w2, w3, w4, w5, w6, w7, w8, w9, w10, w11, w12, w13, w14, w15, w16, w17, w18, w19, w20 };

	//
	// 대역폭을 줄이기 위해 지역 스레드 저장소를 채운다.
	// 흐리기 반지름 때문에 픽셀 N개를 흐리려면 N + 2*BlurRadius개의
	// 픽셀을 읽어야한다.
	//
	// 이 스레드 그룹은 N개의 스레드를 실행한다. 여분의 픽셀 2*BlurRadius 개를
	// 위해, 2*BlurRadius 개의 스레드가 픽셀을 하나 더 추출하게 한다.
	if(groupThreadID.x < gBlurRadius)
	{
		// 이미지 가장자리 바깥의 표본을 이미지 가장자리 표본으로 한정한다.
		int x = max(dispatchThreadID.x - gBlurRadius, 0);
		gCache[groupThreadID.x] = gInput[int2(x, dispatchThreadID.y)];
	}
	if(groupThreadID.x >= N-gBlurRadius)
	{
		// 이미지 가장자리 바깥의 표본을 이미지 가장자리 표본으로 한정한다.
		int x = min(dispatchThreadID.x + gBlurRadius, gInput.Length.x-1);
		gCache[groupThreadID.x+2*gBlurRadius] = gInput[int2(x, dispatchThreadID.y)];
	}

	// 이미지 가장자리 바깥의 표본을 이미지 가장자리 표본으로 한정한다.
	gCache[groupThreadID.x+gBlurRadius] = gInput[min(dispatchThreadID.xy, gInput.Length.xy-1)];

	// 모든 스레드가 이 지점에 도달할 때까지 기다린다.
	GroupMemoryBarrierWithGroupSync();
	
	//
	// 이제 각 픽셀을 블러 처리한다.
	//

	float4 blurColor = float4(0, 0, 0, 0);
	
	for(int i = -gBlurRadius; i <= gBlurRadius; ++i)
	{
		int k = groupThreadID.x + gBlurRadius + i;
		
		blurColor += weights[i+gBlurRadius]*gCache[k];
	}
	
	gOutput[dispatchThreadID.xy] = blurColor;
}

[numthreads(1, N, 1)]
void VertBlurCS(int3 groupThreadID : SV_GroupThreadID,
				int3 dispatchThreadID : SV_DispatchThreadID)
{
	// 가중치들을 배열에 넣는다(색인으로 접근 가능하도록)
	float weights[11] = { w0, w1, w2, w3, w4, w5, w6, w7, w8, w9, w10 };

	//
	// 대역폭을 줄이기 위해 지역 스레드 저장소를 채운다.
	// 흐리기 반지름 때문에 픽셀 N개를 흐리려면 N + 2*BlurRadius 개의
	// 픽셀을 읽어야한다.
	//
	
	// 이 스레드 그룹은 N개의 스레드를 실행한다.여분의 픽셀 2 * BlurRadius 개를
	// 위해, 2*BlurRadius 개의 스레드가 픽셀을 하나 더 추출하게 한다.
	if(groupThreadID.y < gBlurRadius)
	{
		// 이미지 가장자리 바깥의 표본을 이미지 가장자리 표본으로 한정한다.
		int y = max(dispatchThreadID.y - gBlurRadius, 0);
		gCache[groupThreadID.y] = gInput[int2(dispatchThreadID.x, y)];
	}
	if(groupThreadID.y >= N-gBlurRadius)
	{
		// 이미지 가장자리 바깥의 표본을 이미지 가장자리 표본으로 한정한다.
		int y = min(dispatchThreadID.y + gBlurRadius, gInput.Length.y-1);
		gCache[groupThreadID.y+2*gBlurRadius] = gInput[int2(dispatchThreadID.x, y)];
	}
	
	// 이미지 가장자리 바깥의 표본을 이미지 가장자리 표본으로 한정한다.
	gCache[groupThreadID.y+gBlurRadius] = gInput[min(dispatchThreadID.xy, gInput.Length.xy-1)];


	// 모든 스레드가 이 지점에 도달할 때까지 기다린다.
	GroupMemoryBarrierWithGroupSync();
	
	// 
	// 이제 픽셀을 블러 처리한다.
	//
	
	float4 blurColor = float4(0, 0, 0, 0);
	
	for(int i = -gBlurRadius; i <= gBlurRadius; ++i)
	{
		int k = groupThreadID.y + gBlurRadius + i;
		
		blurColor += weights[i+ gBlurRadius]*gCache[k];
	}
	
	gOutput[dispatchThreadID.xy] = blurColor;
}