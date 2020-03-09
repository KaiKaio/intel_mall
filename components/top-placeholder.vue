<template>
	<!-- 顶部状态栏占位符,仅APP生效 -->
	<view>
		<!-- #ifdef APP-PLUS -->
		<view class="status-bar">
			<view class="top-view">
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		name: 'TopPlaceholder',
		data() {
			return {

			};
		}
	}
</script>

<style>
	.status-bar {
		height: var(--status-bar-height);
		width: 100%;
		background: #F8F8F8;
		z-index: 999;
	}

	.top-view {
		height: var(--status-bar-height);
		width: 100%;
		position: fixed;
		background-color: #F8F8F8;
		top: 0;
		z-index: 999;
	}
</style>
