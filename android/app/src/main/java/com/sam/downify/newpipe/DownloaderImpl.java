package com.sam.downify.newpipe;

import org.schabi.newpipe.extractor.downloader.Downloader;
import org.schabi.newpipe.extractor.downloader.Request;
import org.schabi.newpipe.extractor.downloader.Response;
import org.schabi.newpipe.extractor.exceptions.ReCaptchaException;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;

public final class DownloaderImpl extends Downloader {
    private static DownloaderImpl instance;
    private final OkHttpClient client;

    private DownloaderImpl() {
        this.client = new OkHttpClient.Builder()
                .readTimeout(30, TimeUnit.SECONDS)
                .build();
    }

    public static DownloaderImpl getInstance() {
        if (instance == null) {
            instance = new DownloaderImpl();
        }
        return instance;
    }

    public OkHttpClient getClient() {
        return client;
    }

    @Override
    public Response execute(Request request) throws IOException, ReCaptchaException {
        final String httpMethod = request.httpMethod();
        final String url = request.url();
        final Map<String, List<String>> headers = request.headers();
        final byte[] dataToSend = request.dataToSend();

        okhttp3.Request.Builder requestBuilder = new okhttp3.Request.Builder()
                .method(httpMethod, dataToSend == null ? null :
                        RequestBody.create(dataToSend))
                .url(url);

        for (Map.Entry<String, List<String>> header : headers.entrySet()) {
            for (String value : header.getValue()) {
                requestBuilder.addHeader(header.getKey(), value);
            }
        }

        okhttp3.Response response = client.newCall(requestBuilder.build()).execute();
        
        if (response.code() == 429) {
            response.close();
            throw new ReCaptchaException("reCaptcha Challenge requested", url);
        }

        final ResponseBody body = response.body();
        String responseBody = body == null ? "" : body.string();

        return new Response(
                response.code(),
                response.message(),
                response.headers().toMultimap(),
                responseBody,
                response.request().url().toString()
        );
    }
}
